import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TextView from '../components/TextView';

import language from "../constants/language.js"

const {width, height} = Dimensions.get('window');
export default class SearchEverythingScreen extends Component {
  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      searchField: '',
      lan:'en'
    };
    this.handleSearch = this.handleSearch.bind(this);
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if(value == 'fr'){
          this.setState({
            lan:'fr',
          });
        }else{
          this.setState({
            lan:'en',
          });
        }
      }else{
        alert("Else exicute : " + value);
      }
    } catch (error) {
      //alert("error");
      console.log("--------- Error",error);
      // Error retrieving data
    }
  };

  handleSearch() {
    const {searchField} = this.state;
    this.props.navigation.navigate('SearchFilterScreen', {
      searchField,
    });
  }

  searchSuggestions(text) {
    this.props.navigation.navigate('SearchFilterScreen', {
      searchField: text,
    });
  }

  render() {
    const {searchField,lan} = this.state;
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="#ffffff"
          barStyle="dark-content"
          translucent={false}
        />
        <SafeAreaView>
          <View style={styles.headerStyle}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack(null)}>
                <FontAwesome5 name="times" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={{flex: 5}}>
              <TextInput
                placeholder={language.promotions.search_people_hash(lan)}
                value={searchField}
                onChangeText={text => this.setState({searchField: text})}
                onSubmitEditing={this.handleSearch}
              />
            </View>
            <View style={{flex: 2, alignItems: 'center'}}>
              <TouchableOpacity onPress={this.handleSearch}>
                <TextView style={{color: '#000', fontSize: 15}} text='Search' />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        <View style={{paddingTop: 50}}>
          <View style={styles.contentHeader}>
            <TextView style={styles.contentTitle} text='Suggestions' />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              {['act', 'actress', 'lugbe', 'kaduna', 'abuja'].map(e => (
                <Text
                  key={e}
                  style={styles.contentItem}
                  onPress={this.searchSuggestions.bind(this, e)}>
                  {e}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.contentHeader}>
            <TextView style={styles.contentTitle} text='Previous searches' />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {width: 3, height: 0},
    elevation: 3,
    shadowRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#ffffff',
  },
  contentHeader: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  contentTitle: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },
  contentItem: {
    color: '#0052ff',
    fontFamily: 'Poppins',
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontWeight: '400',
  },
});
