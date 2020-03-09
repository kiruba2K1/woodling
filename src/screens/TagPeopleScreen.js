import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  AsyncStorage,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Input} from 'react-native-elements';
import axios from 'axios';
import TagPeopleButton from '../components/TagPeopleButton';
import TagPeopleDelete from '../components/TagPeopleDelete';
import {tagPeople} from '../redux/actions/handleYourMind';
import {fetchuserfollowers} from '../redux/actions/fetchuserfollowers';
import {apiurl} from '../constants/config';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import TextView from '../components/TextView';
import language from '../constants/language.js';

import fontelloConfig from '../config.json';
const Customon = createIconSetFromFontello(fontelloConfig);

const {height, width} = Dimensions.get('window');
export class TagPeopleScreen extends Component {
  state = {
    cheked: false,
    people: [],
    loading: false,
    lan: 'en',
  };

  tagged = [];

  componentWillMount() {
    this.props.fetchuserfollowers(3);
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if (value == 'fr') {
          this.setState({
            lan: 'fr',
          });
        } else {
          this.setState({
            lan: 'en',
          });
        }
      } else {
        alert('Else exicute : ' + value);
      }
    } catch (error) {
      //alert("error");
      console.log('--------- Error', error);
      // Error retrieving data
    }
  };

  deletedItem = e => {
    // Please note that checked is just a dummy state to manually trigger a rerender
    const {checked} = this.state;
    const index = this.tagged.indexOf(e);
    this.tagged.splice(index, 1);
    this.setState({checked: !checked});
  };

  checkstats = e => {
    // Please note that checked is just a dummy state to manually trigger a rerender
    const {checked} = this.state;
    const index = this.tagged.indexOf(e);
    if (this.tagged.includes(e)) {
      this.tagged.splice(index, 1);
    } else {
      this.tagged.push(e);
    }
    this.setState({checked: !checked});
  };

  onChangeText = async e => {
    this.setState({people: [], loading: true});
    axios
      .get(`${apiurl}search-people.php?name=${e}&page=1`)
      .then(res => {
        // console.warn(res.data);
        if (res.data.status === 'success') {
          this.setState({people: res.data.people});
        }
      })
      .catch(res => console.log(res.data));
    this.setState({loading: false});
  };

  submitTagged = () => {
    const {tagPeople, navigation} = this.props;
    tagPeople(this.tagged);
    // console.warn(this.tagged);
    navigation.goBack();
  };

  render() {
    const {fetchfollowers} = this.props;
    const {data} = this.props.fetchfollowers;
    const {people, lan} = this.state;
    return (
      <View style={{flex: 1}}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Customon style={styles.arrowback} name="x" size={15} />
            </TouchableOpacity>
            <TextView style={styles.title} text="Tag People" />
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={this.submitTagged}>
              <TextView style={styles.buttontext} text="Save" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <StatusBar translucent={false} />

        <View
          style={{
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
            //backgroundColor: '#eeeeee',
          }}>
          <View style={styles.searchSection}>
            <View style={{backgroundColor: 'transparent'}}>
              <TextInput
                style={styles.searchExtend}
                placeholder={language.promotions.search_people(lan)}
                onChangeText={this.onChangeText}
              />
            </View>

            <FontAwesome5
              style={styles.searchIcon}
              name="search"
              size={20}
              color="#000"
              onPress={this.handleSearch}
            />
          </View>
        </View>

        <ScrollView horizontal>
          <View
            style={{
              flexDirection: 'row',
              elevation: 3,
              backgroundColor: '#ffffff',
              padding: 8,
            }}>
            {this.tagged.map(e => (
              <TagPeopleDelete
                detail={e}
                key={e.id}
                deletedItem={this.deletedItem}
              />
            ))}
          </View>
        </ScrollView>
        <ScrollView
          style={{position: 'relative', top: 10}}
          contentContainerStyle={{
            zIndex: 1,
            elevation: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#f1f1h1',
          }}>
          <View style={{padding: 20, marginBottom: 20}}>
            <TextView text="Search result" />
            {people.map(e => (
              <TagPeopleButton
                key={e.id}
                username={e.username}
                fullname={e.full_name}
                id={e.id}
                datum={e}
                checkstats={this.checkstats}
              />
            ))}
            <TextView text="Followers" />
            <View>
              {data === undefined ? (
                <ActivityIndicator />
              ) : (
                data.map(e => (
                  <TagPeopleButton
                    key={e.id}
                    username={e.username}
                    fullname={e.full_name}
                    id={e.id}
                    datum={e}
                    checkstats={this.checkstats}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  fetchfollowers: state.followerslist.followers,
});

export default connect(mapStateToProps, {fetchuserfollowers, tagPeople})(
  TagPeopleScreen,
);

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: {width: 3, height: 0},
    elevation: 5,
  },

  title: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },

  buttoncontainer: {
    width: 66,
    height: 30,
    backgroundColor: '#fb0201',
    shadowRadius: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowback: {
    color: '#000',
  },
  buttontext: {
    color: '#ffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },

  searchSection: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 335,
    height: 41,
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 7,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderColor: '#eeeeee',
    borderWidth: 1,
  },

  searchExtend: {
    width: 300,
    height: 41,
    fontSize: 12,
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },
});
