import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  Text,
  View,
  Dimensions,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StatusBar,
  FlatList,
  AsyncStorage,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome';
import {FAB} from 'react-native-paper';
import {Header, Avatar, Input} from 'react-native-elements';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {navigatePost} from '../redux/actions/navigatePost';
import {apiurl, localurl} from '../constants/config';

import fontelloConfig from '../config.json';
import ViewCastingCalls from '../components/ViewCastingCalls';

const Customon = createIconSetFromFontello(fontelloConfig);
const {width, height} = Dimensions.get('window');
import language from '../constants/language.js';
export class CastingCallsScreen extends Component {
  // static navigationOptions = {
  //   title: 'ActivityStream'
  //   // header: null
  // };

  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      isVisible: false,
      castingcalllist: [],
      newCastingCall: [],
      casting_call: '',
      loading: false,
      isFetching: false,
      page: 1,
      searchpage: 1,
    };
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

  componentDidMount() {
    // console.warn('mounted');
    const {user_id, navigation} = this.props;
    const filters = navigation.getParam('filters');
    if (filters) {
      // console.log(filters);
      console.warn('call');
      axios
        .post(`${apiurl}fetch-casting-calls.php?page=1`, filters)
        .then(res => {
          console.warn(res.data);
          this.setState({castingcalllist: res.data.casting_calls});
        })
        .catch(res => console.warn('error'));
    } else {
      axios
        .get(`${apiurl}fetch-all-casting-call.php?user_id=${user_id}&page=1`)
        .then(res => {
          // console.warn(res.data);
          this.setState({castingcalllist: res.data.data});
        })
        .catch(res => console.warn('error'));
      // console.log('pressed');
    }
  }

  addCastingCall() {
    this.setState({post_type: 'photo'});
    this.props.navigation.navigate('AddCastingCalls', {menustatus: 'postajob'});
  }

  handleVideo() {
    this.setState({post_type: 'video'});
  }

  handleEvent() {
    this.setState({post_type: 'event'});
  }

  handleSales() {
    this.setState({post_type: 'sale'});
  }

  handleRecord() {
    this.setState({post_type: 'record'});
  }

  handleSearch = async () => {
    // console.warn('data');
    const {casting_call} = this.state;
    // console.warn(casting_call);
    this.setState({loading: true});
    await axios
      .get(
        `${apiurl}fetch-casting-calls.php?casting_call=${casting_call}&page=1`,
      )
      .then(res => {
        console.warn(res.data);
        this.setState({newCastingCall: res.data});
      })
      .catch(res => console.warn(res.data));
    this.setState({loading: false});
  };

  onRefresh = async () => {
    const {user_id, navigation} = this.props;
    this.setState({castingcalllist: [], page: 1});
    await axios
      .get(`${apiurl}fetch-all-casting-call.php?user_id=${user_id}`)
      .then(res => {
        console.log(res.data);
        this.setState({castingcalllist: res.data.data});
      })
      .catch(res => console.log('error'));
  };

  onEndReached = () => {
    const {castingcalllist, page} = this.state;
    const {user_id, navigation} = this.props;
    const filters = navigation.getParam('filters');
    if (filters) {
      axios
        .get(
          `${apiurl}fetch-all-casting-call.php?user_id=${user_id}&page=${page +
            1}`,
        )
        .then(res => {
          // console.warn(res.data);
          this.setState({page: page + 1});
          if (res.data.status === 'success') {
            this.setState({
              castingcalllist: castingcalllist.concat(res.data.data),
            });
          } else {
            this.setState({castingcalllist: castingcalllist.concat([])});
          }
        })
        .catch(res => console.warn('error'));
    } else {
      axios
        .post(`${apiurl}fetch-casting-calls.php?page=1`, filters)
        .then(res => {
          this.setState({page: page + 1});
          // console.warn(res.data);
          if (res.data.status === 'success') {
            this.setState({
              castingcalllist: castingcalllist.concat(res.data.casting_calls),
            });
          }
        })
        .catch(res => console.warn('error'));
    }
  };

  render() {
    const {id} = this.props;
    const {
      castingcalllist,
      loading,
      casting_call,
      newCastingCall,
      isFetching,
      lan,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#ededed', marginBottom: 70}}>
        <StatusBar
          backgroundColor="white"
          translucent={false}
          barStyle="dark-content"
        />

        <FAB
          style={styles.fab}
          small
          icon={() => <Customon name="plus" color="#fb0201" size={22} />}
          onPress={this.addCastingCall.bind(this)}
        />

        <View
          style={{
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.searchSection}>
            <View style={{backgroundColor: 'transparent'}}>
              <TextInput
                style={styles.searchExtend}
                placeholder={language.promotions.search_casting_calls(lan)}
                onChangeText={casting_call => this.setState({casting_call})}
                onSubmitEditing={this.handleSearch}
              />
            </View>
            {loading === false ? (
              <FontAwesome5
                style={styles.searchIcon}
                name="search"
                size={20}
                color="#000"
                onPress={this.handleSearch}
              />
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </View>

        <View style={{backgroundColor: '#eeeeee'}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              newCastingCall.casting_calls && (
                <Text style={{fontSize: 100}}>No activity found</Text>
              )
            }
            data={
              casting_call !== ''
                ? newCastingCall.casting_calls
                : castingcalllist
            }
            removeClippedSubviews
            contentContainerStyle={{marginTop: 10}}
            refreshing={this.state.isFetching}
            onEndReached={this.onEndReached}
            onRefresh={this.onRefresh}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ViewCastingCalls
                title={item.title}
                roles_count={item.roles_count}
                production_type={item.production_type}
                formatted_address={item.formatted_address}
                description={item.description}
                date_created={item.date_created}
                skill={item.skill}
                active={item.active}
                postid={item.id}
                created_by={item.created_by}
              />
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainerStyle: {height: 20, borderBottomWidth: 0},
  containerStyle: {
    width: 200,
    borderWidth: 3,
    borderRadius: 20,
    height: 25,
    justifyContent: 'center',
    borderColor: '#dedede',
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
  },

  searchExtend: {
    width: 300,
    height: 41,
    fontSize: 12,
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: -40,
    zIndex: 23,
    backgroundColor: '#fff',
    borderColor: '#fb0201',
    borderWidth: 2,
  },
});

// const mapStateToProps = state => ({
//   id: state.userid.id
// });
const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  activitystreamdata: state.activitystreamdata.activitystream,
});

export default connect(mapStateToProps)(CastingCallsScreen);
