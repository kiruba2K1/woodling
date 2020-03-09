import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  PermissionsAndroid,
  AsyncStorage
} from 'react-native';
import axios from 'axios';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Input} from 'react-native-elements';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {addlocation} from '../redux/actions/handleYourMind';
import AddLocationComponent from '../components/AddLocation';
import Geolocation from 'react-native-geolocation-service';
import TextView from '../components/TextView';

import language from "../constants/language.js"
import fontelloConfig from '../config.json';

const Customon = createIconSetFromFontello(fontelloConfig);
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {height, width} = Dimensions.get('window');
export class AddLocation extends Component {
  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      locationChanged: '',
      addressoptions: [],
    };
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
  // componentDidUpdate(prevprops, newState) {
  //   console.log(this.state.addressoptions)
  //   }

  getPermission = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      )
        .then(granted => {
          if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            this.getCurrentLocation();
          } else {
            alert('Please give permission of location');
          }
        })
        .catch(eror => {
          alert('Error getting permission of location');
        });
    }
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      this.getCurrentLocation();
    }
  };

  getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        this.getPlaceByLatLng(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      error => {
        console.warn(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        showLocationDialog: true,
      },
    );
  };

  getPlaceByLatLng = (lat, lng) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDnd-OjoFVYBZjbB9ok_Pw8pGj0AyhLpjI`,
      )
      .then(ans => {
        // var formatted_address = ans.data.results[0].formatted_address;
        // var city = "";
        var state = '';
        var country = '';
        var city = '';
        // ans.data.results[0].address_components.map(value => {
        //   if (value.types[0] == "locality" && value.types[1] == "political") {
        //     city = value.long_name;
        //   }
        // });
        ans.data.results[0].address_components.map(value => {
          if (
            value.types[0] == 'administrative_area_level_1' &&
            value.types[1] == 'political'
          ) {
            state = value.long_name;
            city = value.long_name;
          }
        });
        ans.data.results[0].address_components.map(value => {
          if (value.types[0] == 'country' && value.types[1] == 'political') {
            country = value.long_name;
          }
        });
        const formatted_address = state + ', ' + country;
        const coord = ans.data.results[0].geometry.location;
        const data = {state, city, country, ...coord, formatted_address};
        this.props.addlocation(data);
        this.props.navigation.goBack();
      });
  };

  async textChanged(text) {
    // DEBUG:
    const {locationChanged, addressoptions} = this.state;
    this.setState({locationChanged: text});
    await axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDnd-OjoFVYBZjbB9ok_Pw8pGj0AyhLpjI&input=${locationChanged}&radius=50`,
      )
      .then(res => {
        this.setState({addressoptions: res.data.predictions});
        // console.log(res.data);
      });
  }

  handleLocation(e) {
    const len = e.terms.length - 1;
    const len2 = e.terms.length - 2;
    const formatted_address = e.description;
    const state = e.terms.length > 1 ? e.terms[len2].value : '';
    const country = e.terms[len].value;
    // console.log(city, country);
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${e.place_id}&key=AIzaSyDnd-OjoFVYBZjbB9ok_Pw8pGj0AyhLpjI`,
      )
      .then(ans => {
        console.log(ans.data.results[0].geometry.location);
        const coord = ans.data.results[0].geometry.location;
        const data = {formatted_address, state, country, city: state, ...coord};
        this.props.addlocation(data);
        this.props.navigation.goBack();
      });
  }

  render() {
    const {locationChanged, addressoptions,lan} = this.state;
    return (
      <View style={{height, width}}>
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
                placeholder={language.promotions.search_for_location(lan)}
                value={this.state.locationChanged}
                onChangeText={this.textChanged.bind(this)}
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
        <ScrollView
          contentContainerStyle={{
            marginTop: 20,
            elevation: 1,
            width,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#f1f1h1',
          }}>
          <View style={{height: 700}}>
            <View
              style={{
                paddingVertical: 10,
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: '#dedede',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red',
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  marginLeft: 20,
                }}>
                <Customon name="map-marker-alt" size={30} color="white" />
              </View>
              <TouchableOpacity onPress={this.getPermission}>
                <View style={{justifyContent: 'center', marginHorizontal: 20}}>
                  <TextView
                    style={{color: 'black', fontSize: 15, fontWeight: 'bold'}} text='Use current location'>

                  </TextView>
                </View>
              </TouchableOpacity>
            </View>
            {addressoptions === [] ? (
              <ActivityIndicator />
            ) : (
              addressoptions.map(e => (
                <TouchableOpacity
                  key={e.id}
                  onPress={this.handleLocation.bind(this, e)}
                  style={{
                    // width,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#dedede',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'red',
                      height: 50,
                      width: 50,
                      borderRadius: 50,
                    }}>
                    <Customon name="map-marker-alt" size={30} color="white" />
                  </View>
                  <View style={{marginHorizontal: 20}}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      {e.description}
                    </Text>
                    <Text>{e.terms[e.terms.length - 1].value}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  null,
  {addlocation},
)(AddLocation);

const styles = StyleSheet.create({
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
