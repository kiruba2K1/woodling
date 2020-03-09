import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  PermissionsAndroid,
  FlatList,
  Platform,
  Alert,
  Slider,
  KeyboardAvoidingView,
  AsyncStorage
} from 'react-native';
import language from "../constants/language.js"
let lang = "de"
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Input} from 'react-native-elements';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {addlocation} from '../redux/actions/handleYourMind';
import AddLocationComponent from '../components/AddLocation';
import Geolocation from 'react-native-geolocation-service';
import {
  viewActivityStream,
  clearActivityStream,
} from '../redux/actions/viewActivityStream';
import fontelloConfig from '../config.json';
import { Avatar } from 'react-native-paper';

const Customon = createIconSetFromFontello(fontelloConfig);
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {mapkey} from '../constants/config';

import WalletPromotion from '../components/WalletPromotion';
import Swiper from 'react-native-swiper';
import { apiurl, localurl,imageurl } from '../constants/config';

const {height, width} = Dimensions.get('window');

class ChooseAudience extends Component {
  constructor(props){
    super(props);
    this._retrieveData();
    const { navigation } = this.props;
    const user_id = navigation.getParam('user_id', 'NO-ID');
    const theirid = navigation.getParam('theirid', 'NO-ID');
    const postid = navigation.getParam('postid', 'NO-ID');

    console.log("Profile Pic : ", this.props.profilepicture);

    console.log("-------------- User Clicked Appointment Data Received --------------");
    console.log("user_id : " + user_id);
    console.log("theirid : " + theirid);
    console.log("postid : " + postid);
    this.state = {
      selectedLanguage:'en',
      userid: user_id,
      postid: postid,
      theirid: theirid,
      potentialAud:'0',
      estimateReached:0,
      totalPrice:0,
      sliderpoints: [22, 37],
      index:0,
      days:0,
      price:0,
      submitButtonName:language.promotions.next('en'),
      title:language.promotions.choose_audience('en'),
      option:-1,
      categoryText:'',
      locationChanged: '',
      addressoptions: [],
      selectedLocation: [],
      selectedCategory: [],
      allCategory:[],
      strLocation:'',
      strCategory:'',
      strAgeRange:'',
      strGender:'',
      ageRange:[
        {
          key:1,
          status:false,
          name: language.promotions.select_all('en')
        },
        {
          key:2,
          status:false,
          name: language.promotions.female('en')
        },
        {
          key:3,
          status:false,
          name: language.promotions.male('en')
        },
        {
          key:4,
          status:false,
          name: language.promotions.non_binary('en')
        },
        {
          key:5,
          status:false,
          name: language.promotions.transgender('en')
        },
        {
          key:6,
          status:false,
          name: 'Genderfluid'
        },
        {
          key:7,
          status:false,
          name: language.promotions.other('en')
        },
      ],
    };

    this.getCategory();
    this.getPotentialAudience();
    this.getWalletBalance();
  }

  _retrieveData = async () => {
    // console.log("********* Method called : ")
    try {
      const value = await AsyncStorage.getItem('lan');

      if (value !== null) {
        // We have data!!
        console.log(value);
        if(value == 'fr'){
          this.setState({
            selectedLanguage:'fr',
            submitButtonName:language.promotions.next('fr'),
            title:language.promotions.choose_audience('fr'),
          });
        }else{
          this.setState({
            selectedLanguage:'en',
          });
        }
      }else{
        //alert("Else exicute : " + value);
      }
    } catch (error) {
      // alert("error");
      // console.log("--------- Error",error);
      // Error retrieving data
    }
  };

  getPermission = () => {
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
    console.log(lng, lat);
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDnd-OjoFVYBZjbB9ok_Pw8pGj0AyhLpjI`,
      )
      .then(ans => {
        console.log(ans.data);
        // var formatted_address = ans.data.results[0].formatted_address;
        // var city = "";
        var state = '';
        var country = '';
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
            city = value.long_name;
            state = value.long_name;
          }
        });
        ans.data.results[0].address_components.map(value => {
          if (value.types[0] == 'country' && value.types[1] == 'political') {
            country = value.long_name;
          }
          if (
            value.types[0] == 'political' &&
            value.types[1] == 'sublocality' &&
            value.types[2] == 'sublocality_level_1'
          ) {
            formatted_address = value.long_name;
          }
        });
        const coord = ans.data.results[0].geometry.location;
        const data = {state, city, formatted_address, country, ...coord};
        console.log(data);
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
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${mapkey}&input=${locationChanged}&radius=50`,
      )
      .then(res => {
        this.setState({addressoptions: res.data.predictions});
        // console.log(res.data);
      });
  }

  getCategory(key) {
    this.setState({categoryText: key});
    fetch(apiurl + 'search-individual-skills.php?user_id=58&search=' + key, {
              method: 'GET',
              headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {

            return response.json();
          })
          .then((responseJson) => {
            console.log("---------------------- DATA --------------------");
            console.log(responseJson.data);
            this.setState({allCategory: responseJson.data});
            return responseJson.data;
          })
          .catch((error) => {
            console.error(error);
          });
  }

  getPotentialAudience() {

    var {strLocation,strCategory,strGender,strAgeRange} =this.state;

    console.log("----------- Location : " + strLocation);
    console.log("----------- Category : " + strCategory);
    console.log("----------- Gender : " + strGender);
    console.log("----------- AgeRange : " + strAgeRange);


    fetch(apiurl + 'get-potential-audience.php', {
              method: 'POST',
              headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: this.state.userid,
              locations: strLocation,
              categories: strCategory,
              gender: strGender,
              age: strAgeRange,
            })
          })
          .then((response) => {

            return response.json();
          })
          .then((responseJson) => {
            console.log("---------------------- DATA --------------------");
            console.log(responseJson.data);
            this.setState({potentialAud: responseJson.data.number_of_audience});
            return responseJson.data;
          })
          .catch((error) => {
            console.error(error);
          });
  }

  getWalletBalance() {
    fetch(apiurl + 'fetch-user-balance.php?user_id=' + this.state.userid, {
              method: 'GET',
              headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {

            return response.json();
          })
          .then((responseJson) => {
            console.log("---------------------- DATA --------------------");
            console.log(responseJson);
            if(responseJson.status == 'success'){
              if(responseJson.user_balance != 'empty'){
                console.log(responseJson.user_balance[0].usd_balance);
                this.setState({userBalance: responseJson.user_balance[0].usd_balance});
              }else{
                console.log('User Balance is Empty');
                  this.setState({userBalance: 0});
              }
            }
            return responseJson.data;
          })
          .catch((error) => {
            console.error(error);
            this.setState({userBalance: 0});
          });
  }



  handleCategory(e) {

    console.log(e);

    var arr = this.state.selectedCategory;
    arr = [...arr,e];

    const newArray = [];
    arr.forEach(obj => {
      if (!newArray.some(o => o.id === obj.id)) {
        newArray.push({ ...obj })
      }
    });
    console.log("Arr : " , arr)

    this.setState({selectedCategory:newArray})
  }

  handleLocation(e) {

    console.log(e);
    const len = e.terms.length - 1;
    const len2 = e.terms.length - 2;
    const formatted_address = e.description;
    const state = e.terms.length > 1 ? e.terms[len2].value : '';
    const country = e.terms[len].value;

    var arr = this.state.selectedLocation;
    arr = [...arr,e];


    const newArray = [];
    arr.forEach(obj => {
      if (!newArray.some(o => o.id === obj.id)) {
        newArray.push({ ...obj })
      }
    });
    console.log("Arr : " , newArray)

    this.setState({selectedLocation:newArray})

    this.setState({
      addressoptions: []
    });
    // console.log(city, country);
    // axios
    //   .get(
    //     `https://maps.googleapis.com/maps/api/geocode/json?place_id=${e.place_id}&key=${mapkey}`,
    //   )
    //   .then(ans => {
    //     console.log(ans.data);
    //     // console.log(ans.data.results[0].geometry.location);
    //     const coord = ans.data.results[0].geometry.location;
    //     const data = {formatted_address, state, country, ...coord};
    //     this.props.addlocation(data);
    //     this.props.navigation.goBack();
    //   });
  }

  async textChanged(text) {
    // DEBUG:
    const {locationChanged, addressoptions} = this.state;
    this.setState({locationChanged: text});

    await axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${mapkey}&input=${locationChanged}&radius=50`,
      )
      .then(res => {
        this.setState({addressoptions: res.data.predictions});
        // console.log(res.data);
      });
  }

  _onPressLocation(){
    this.setState({
      title:language.promotions.add_location(this.state.selectedLanguage),
      option:1,
      submitButtonName:language.promotions.done(this.state.selectedLanguage)
    })
  }

  _onPressCategory(){
    this.setState({
      title:language.promotions.select_categories(this.state.selectedLanguage),
      option:2,
      submitButtonName:language.promotions.done(this.state.selectedLanguage)
    })
  }

  _onPressAgeRange1(){
    this.setState({
      title:language.promotions.choose_age_range(this.state.selectedLanguage),
      option:3,
      submitButtonName:language.promotions.done(this.state.selectedLanguage)
    })
  }

  _onPressAgeRange(){
    this.setState({
      title:language.promotions.choose_age_range(this.state.selectedLanguage),
      option:4,
      submitButtonName:language.promotions.done(this.state.selectedLanguage)
    })
  }

  _removeFromLocation(index){
    var array = [...this.state.selectedLocation]; // make a separate copy of the array
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({selectedLocation: array});
    }
  }

  _removeFromCategory(index){
    var array = [...this.state.selectedCategory]; // make a separate copy of the array
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({selectedCategory: array});
    }
  }

  _ageRangeChangeStatus(index){
    var array = [...this.state.ageRange];

    if(index==0){
      for (var i=0; i < this.state.ageRange.length; i++) {
        array[i].status = true;
      }

    }else{
      if(array[index].status)
      {
        array[0].status = false;
      }
      array[index].status = !array[index].status;
    }

      this.setState({ageRange:array});

  }


  _changeValuesDuration(value){
    console.log(value);
    this.setState({days:value});
    this.calculateEstReach();
  }
  _changeValuesPrice(value){
      this.setState({price:value});
      this.calculateEstReach();
  }

  _onSubmitClick(){


    if(this.state.option == -1){
      // this.setState({
      //   index:1
      // })
      if(this.state.index == 0 || this.state.index == 1){
        this.refs.swiper.scrollBy(1);
      }

    }else{
      var location = '';
      for (var i=0; i < this.state.selectedLocation.length; i++) {
        location = location + this.state.selectedLocation[i].description  + "&" ;
      }

      var category = '';
      for (var i=0; i < this.state.selectedCategory.length; i++) {
        category = category + this.state.selectedCategory[i].name  + "," ;
      }

      var gender = '';
      for (var i=1; i < this.state.ageRange.length; i++) {
        if(this.state.ageRange[i].status){
          gender = gender + this.state.ageRange[i].name  + "," ;
        }
      }

      if(gender!=''){
        gender = gender.substring(0, gender.length-1);
      }

      if(category!=''){
        category = category.substring(0, category.length-1);
      }

      if(location!=''){
        location = location.substring(0, location.length-1);
      }

      var age =  this.state.strAgeRange;

      if(this.state.option == 3){
        age = this.state.sliderpoints[0] + "-" +  this.state.sliderpoints[1];
      }

      this.setState({
        strLocation:location,
        strCategory:category,
        strAgeRange:age,
        strGender:gender,
        title:language.promotions.choose_audience(this.state.selectedLanguage),
        option:-1,
        submitButtonName:language.promotions.next(this.state.selectedLanguage),
      });

      this.getPotentialAudience();

    }
  }

  _backPressCall(){
    if(this.state.option == -1){
        Alert.alert(
        'Promotion',
        'Are you sure? \nYou want to discard the promotion.',
        [
          {text: 'Yes', onPress: () => this.props.navigation.goBack()},
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }else{
      this.setState({
        title:language.promotions.choose_audience(this.state.selectedLanguage),
        option:-1,
        submitButtonName:language.promotions.next(this.state.selectedLanguage)
      })
    }
  }

  calculateEstReach(){
    const {price,days} = this.state;
    var x = price * days;
    var y = (x/5)*1000;
    this.setState({estimateReached:y,totalPrice:x})
    console.log("Number Of Reached : " + y)
  }

  onIndexChange(index){
    this.setState({
      index:index
    })
    console.log(index);
  }

  onPaymentRequest(){
    this.addPromotion();
  }

  addPromotion() {

    console.log("================ Add Promotion ================");
    console.log("user_id : " + this.state.userid);
    //console.log("theirid : " + this.state.theirid);
    console.log("postid : " + this.state.postid);
    console.log("duration : " + this.state.days);
    console.log("total_budget : " + this.state.totalPrice);
    console.log("age : " + this.state.sliderpoints[0] + "," +  this.state.sliderpoints[1]);
    console.log("location : " + this.state.strLocation);
    console.log("tag_set : " + this.state.strCategory);
    console.log("gender_set : " + this.state.strGender);
    const data = {
      user_id:this.state.userid,
      page:1
    };

    fetch(apiurl + 'add-promotion.php', {
              method: 'POST',
              headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: this.state.userid,
              post_id: this.state.postid,
              duration: this.state.days,
              total_budget: this.state.totalPrice,
              age: this.state.sliderpoints[0] + "," +  this.state.sliderpoints[1],
              location: this.state.strLocation,
              tag_set: this.state.strCategory,
              gender_set: this.state.strGender,
            })
          })
          .then((response) => {

            return response.json();
          })
          .then((responseJson) => {
            console.log("---------------------- DATA --------------------");
            console.log(responseJson);
            if(responseJson.status == 'success' || responseJson.status == 'success'){
                try{
                  this.props.clearActivityStream();
                  this.props.viewActivityStream(data);
                }catch(err){
                  console.error(err);
                }
                Toast.show(responseJson.message, {
                  duration: Toast.durations.LONG,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                  backgroundColor: 'red',
                  textColor: 'white'
                });
                this.props.navigation.goBack();
            }else{
              Toast.show(responseJson.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: 'red',
                textColor: 'white'
              });
            }

            // this.setState({potentialAud: responseJson.data.number_of_audience});
            return responseJson.data;
          })
          .catch((error) => {
            console.error(error);
          });
  }

  onSelect = data => {
    //this.props.navigation.goBack();
    console.log("Choose Audience onSelectCalls");
    this.getWalletBalance();
  };


  changeLang(){
    // const {selectedLanguage} = this.state;
    // if(selectedLanguage == 'fr'){
    //   this.setState({selectedLanguage:'en'});
    // }else{
    //   this.setState({selectedLanguage:'fr'});
    // }
  }

  render() {

    const { sliderpoints,selectedLanguage } = this.state;

    const {locationChanged,addressoptions} = this.state;

    const container = <View>
                        <TouchableOpacity onPress={()=> this._onPressLocation()}>
                            <View style={styles.menuTabs}>
                                <View style={{flexDirection:'column'}}>
                                  <Text style={styles.menu}>{language.promotions.locations(selectedLanguage)}</Text>
                                  <Text style={{marginLeft:10}}>{this.state.strLocation}</Text>
                                </View>
                                <FontAwesome5 style={styles.arrowfront} name="chevron-right" size={15} />

                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this._onPressCategory()}>
                            <View style={styles.menuTabs}>
                                <View style={{flexDirection:'column'}}>
                                  <Text style={styles.menu}>{language.promotions.categories(selectedLanguage)}</Text>
                                  <Text style={{marginLeft:10}}>{this.state.strCategory}</Text>
                                </View>
                                <FontAwesome5 style={styles.arrowfront} name="chevron-right" size={15} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this._onPressAgeRange1()}>
                            <View style={styles.menuTabs}>
                                <View style={{flexDirection:'column'}}>
                                  <Text style={styles.menu}>{language.promotions.age(selectedLanguage)}</Text>
                                  <Text style={{marginLeft:10}}>{this.state.strAgeRange}</Text>
                                </View>
                                <FontAwesome5 style={styles.arrowfront} name="chevron-right" size={15} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this._onPressAgeRange()}>
                            <View style={styles.menuTabs}>

                                <View style={{flexDirection:'column'}}>
                                  <Text style={styles.menu}>{language.promotions.gender(selectedLanguage)}</Text>
                                  <Text style={{marginLeft:10}}>{this.state.strGender}</Text>
                                </View>
                                <FontAwesome5 style={styles.arrowfront} name="chevron-right" size={15} />
                            </View>
                        </TouchableOpacity>
                    </View>;

    const location_sc = <View>
                          <View
                            style={{
                              padding: 15,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View style={styles.searchSection}>

                              <TextInput
                                style={{width:'90%',color:'black'}}
                                placeholder="Search for Location"
                                value={this.state.locationChanged}
                                onChangeText={this.textChanged.bind(this)}
                              />

                              <FontAwesome5
                                style={{width:'10%'}}
                                name="search"
                                size={20}
                                color="#000"
                                onPress={this.handleSearch}
                              />
                            </View>

                            <FlatList
                              data={this.state.selectedLocation}
                              style={{marginTop:10}}
                              renderItem={({item,index}) => (
                                <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'center'}}>
                                  <Text style={{width:'85%',color:'black',}}>{item.description}</Text>

                                    <FontAwesome5
                                      name="window-close"
                                      size={15}
                                      color="#000"
                                      onPress={()=>this._removeFromLocation(index)}
                                    />
                                </View>
                              )}/>
                          </View>

                          <ScrollView
                            contentContainerStyle={{
                              marginTop: 5,
                              elevation: 1,
                              width,
                              backgroundColor: '#f1f1h1',
                            }}>
                            <View>

                              {addressoptions === [] ? (
                                <ActivityIndicator />
                              ) : (
                                addressoptions.map(e => (
                                  <TouchableOpacity
                                    key={e.id}
                                    onPress={(this.handleLocation.bind(this, e))}
                                    style={{
                                      paddingVertical: 10,
                                      paddingHorizontal: 20,
                                      flexDirection: 'row',
                                      borderBottomWidth: 1,
                                      borderBottomColor: '#dedede',
                                    }}>
                                    <View style={{marginHorizontal: 20}}>
                                      <Text
                                        style={{
                                          fontSize: 15,
                                          color: 'black',
                                          fontWeight: 'bold',
                                        }}>
                                        {e.description}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ))
                              )}
                            </View>
                          </ScrollView>
                      </View>;

    const category_sc =  <View>
                          <View
                            style={{
                              padding: 15,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View style={styles.searchSection}>

                              <TextInput
                                style={{width:'90%',color:'black'}}
                                placeholder="Search for Category"
                                value={this.state.categoryText}
                                onChangeText={this.getCategory.bind(this)}
                              />

                              <FontAwesome5
                                style={{width:'10%'}}
                                name="search"
                                size={20}
                                color="#000"
                                onPress={this.handleSearch}
                              />
                            </View>

                            <FlatList
                              data={this.state.selectedCategory}
                              style={{marginTop:10}}
                              renderItem={({item,index}) => (
                                <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{width:'85%',color:'black',}}>{item.name}</Text>

                                    <FontAwesome5
                                      name="window-close"
                                      size={15}
                                      color="#000"
                                      onPress={()=>this._removeFromCategory(index)}
                                    />
                                </View>
                              )}/>

                            <ScrollView
                              contentContainerStyle={{
                                marginTop: 5,
                                elevation: 1,
                                width,
                                backgroundColor: '#f1f1h1',
                              }}>
                              <View>
                                {this.state.allCategory === [] ? (
                                  <ActivityIndicator />
                                ) : (
                                  this.state.allCategory.map(e => (
                                    <TouchableOpacity
                                      key={e.id}
                                      onPress={(this.handleCategory.bind(this, e))}
                                      style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#dedede',
                                      }}>
                                      <View style={{marginHorizontal: 20}}>
                                        <Text
                                          style={{
                                            fontSize: 15,
                                            color: 'black',
                                            fontWeight: 'bold',
                                          }}>
                                          {e.name}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  ))
                                )}
                              </View>
                            </ScrollView>
                          </View>
                      </View>;

    const chooseAgeRange_sc1 =  <View style={{justifyContent:'center',alignItems:'center',padding:10}}>
                                  <View style={styles.shdowBox}>

                                    <MultiSlider
                                      isMarkersSeparated
                                      snapped
                                      customMarkerLeft={() => (
                                        <View>
                                          <Text style={{ position: 'absolute', bottom: 20 }}>{sliderpoints[0]}</Text>
                                          <Icon
                                            name="circle"
                                            size={20}
                                            color="red"
                                            style={{ backgroundColor: '#f1f1f1' }}
                                          />
                                        </View>
                                      )}
                                      customMarkerRight={() => (
                                        <View>
                                          <Text style={{ position: 'absolute', bottom: 20 }}>{sliderpoints[1]}</Text>
                                          <Icon
                                            name="circle"
                                            size={20}
                                            color="red"
                                            style={{ backgroundColor: '#f1f1f1' }}
                                          />
                                        </View>
                                      )}
                                      values={sliderpoints}
                                      onValuesChange={e => this.setState({ sliderpoints: e })}
                                      minMarkerOverlapDistance={10}
                                      min={0}
                                      max={100}
                                      selectedStyle={{ backgroundColor: 'red', height: 3 }}
                                      markerStyle={{ backgroundColor: 'white', borderColor: 'red', borderWidth: 2 }}
                                    />
                                  </View>
                                  <Text>{this.state.sliderpoints[0]} - {this.state.sliderpoints[1]} Years</Text>
                                </View>;

    const chooseAgeRange_sc =  <View>

                                <FlatList
                                  data={this.state.ageRange}
                                  style={{marginTop:10}}
                                  renderItem={({item,index}) => (
                                    <TouchableOpacity onPress={()=>this._ageRangeChangeStatus(index)} style={{marginTop:5,flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'center'}}>
                                        <FontAwesome5
                                          name="check"
                                          size={10}
                                          color={item.status ? 'red' : '#fccccc'}
                                          style={item.status ? styles.checkBoxSelected : styles.checkBoxDeSelected}
                                        />
                                        <Text style={{marginLeft:10,width:'85%',color:'black',}}>{item.name}</Text>

                                    </TouchableOpacity>
                                  )}/>

                                </View>;


    var data_screen;
    if(this.state.option == -1){
      data_screen = container;
    }else if(this.state.option == 1){
      data_screen = location_sc;
    }else if(this.state.option == 2){
      data_screen = category_sc;
    }else if(this.state.option == 3){
      data_screen = chooseAgeRange_sc1;
    }else if(this.state.option == 4){
      data_screen = chooseAgeRange_sc;
    }
    const {profilepicture} = this.props;

    return (
      <KeyboardAvoidingView behavior= {(Platform.OS === 'ios')? "padding" : null} style={styles.container}>
          {
            <View style={styles.header}>
              <TouchableOpacity onPress={()=>this._backPressCall()}>
                {this.state.option == -1 ? (<FontAwesome5 style={styles.arrowback} name="arrow-left" size={15} />) : (<FontAwesome5 style={styles.arrowback} name="times" size={15} />)}
              </TouchableOpacity>
              <Text style={styles.title}> {this.state.title} </Text>
              <TouchableOpacity onPress={()=>this.changeLang()}>
              <Avatar.Image size={38} source={ profilepicture==undefined || profilepicture == null ? require('../images/ic_account_circle_red_24px.jpg') : { uri: `${imageurl}/${profilepicture}`}} />
              </TouchableOpacity>
            </View>
          }

          <Swiper
              ref='swiper'
              index= {this.state.index}
              onIndexChanged={(idxActive) => this.onIndexChange(idxActive)}
              style={styles.wrapper}
              showsButtons={false}
              nextButton={<Icon name="chevron-right" size={20} color="red" />}
              prevButton={<Icon name="chevron-left" size={20} color="red" />}
              showsPagination = {true}
              loop={false}
              dot={<View style={{backgroundColor: '#fecbcb', width: 7, height: 7, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
              activeDot={<View style={{ backgroundColor: '#fb0201', width: 7, height: 7, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
              paginationStyle={{
              bottom: '95%'
              }}>
              <View style={{flex:1}}>
                    <View style={{marginTop:30,height:4,width:'33.33%',backgroundColor:'red'}}></View>
                    <View style={{justifyContent: 'center', alignItems: 'center', padding: 30}}>
                      <Text style={styles.text1}>{this.state.potentialAud}</Text>
                        <Text style={styles.text2}>{language.promotions.potential_audience(selectedLanguage)}</Text>
                    </View>

                    <ScrollView style={{flex:1}}>
                      {data_screen}
                    </ScrollView>

                    <View style={styles.submitBtn}>

                      <TouchableOpacity onPress={()=>this._onSubmitClick()}>
                        <View style={styles.buttonTab}>
                          <Text style={{fontFamily: 'Poppins-Medium', color: '#ffff'}}> {this.state.submitButtonName} </Text>
                        </View>
                    </TouchableOpacity>


                    </View>
              </View>

              <View style={[styles.slide2,{flexDirection:'column',flex:1}]}>
                  <View style={{marginTop:30,height:4,width:'66.66%',backgroundColor:'red'}}></View>

                <ScrollView style={{flex:1}}>
                      <View style={{flex:1,flexDirection:'column'}}>

                      <Text style={{fontSize:18,fontWeight:'bold',textAlign:'center',width:'100%'}}>{language.promotions.duration(selectedLanguage)}</Text>
                      <Text style={{marginTop:10,fontSize:15,textAlign:'center',width:'100%'}}>{this.state.days} {language.promotions.days(selectedLanguage)}</Text>
                      <View style={{height:80, flexDirection: 'column',alignItems:'center'}}>

                          <View style={styles.shdowBox}>
                              <Slider
                                style={{width:'100%',padding:10}}
                                step={1}
                                maximumValue={20}
                                onValueChange={(value)=>this._changeValuesDuration(value)}
                                customMarker={(e) => {
                                 return (<View style={styles.customThumb}></View>)
                                }}
                                value={this.state.days}
                              />
                          </View>


                      </View>

                      <Text style={{marginTop:20,fontSize:18,fontWeight:'bold',textAlign:'center',width:'100%'}}>Budget</Text>
                      <Text style={{marginTop:10,fontSize:15,textAlign:'center',width:'100%'}}>${this.state.price} {language.promotions.per_day(selectedLanguage)}</Text>
                      <View style={{height:80, flexDirection: 'column',alignItems:'center'}}>

                          <View style={styles.shdowBox}>
                              <Slider
                                style={{width:'100%',padding:10}}
                                step={1}
                                maximumValue={20}
                                onValueChange={(value)=>this._changeValuesPrice(value)}
                                thumbStyle={(e) => {
                                 return (<View style={styles.customThumb}></View>)
                                }}

                                value={this.state.price}
                              />
                          </View>

                      </View>

                      <View style={[styles.menuTabs,{paddingTop:10,paddingBottom:10,flexDirection:'column',alignItems:'center'}]}>
                          <Text style={{color: '#000000',fontFamily: 'Poppins-Medium',fontSize: 20}}>{this.state.estimateReached}</Text>
                          <Text style={styles.text2}>{language.promotions.estimate_reach(selectedLanguage)}</Text>
                      </View>

                      <View style={[styles.menuTabs,{paddingTop:25,paddingBottom:25,flexDirection:'column',alignItems:'center'}]}>
                          <Text style={styles.text2}>{language.promotions.total_spends(selectedLanguage)}</Text>
                          <Text style={{color: '#000000',fontFamily: 'Poppins-Medium',fontSize: 20}}>${this.state.totalPrice} {language.promotions.over(selectedLanguage)} {this.state.days} {language.promotions.days(selectedLanguage)}</Text>
                      </View>
                    </View>

                  </ScrollView>
                  <View style={styles.submitBtn}>
                  {
                    <TouchableOpacity onPress={()=>this._onSubmitClick()}>
                        <View style={styles.buttonTab}>
                          <Text style={{fontFamily: 'Poppins-Medium', color: '#ffff'}}> {language.promotions.next(selectedLanguage)} </Text>
                        </View>
                    </TouchableOpacity>
                  }
                  </View>
              </View>

              <View style={[styles.slide3,{flex:1}]}>
                <View style={{marginTop:30,height:4,width:'100%',backgroundColor:'red'}}></View>
                <View style={{justifyContent: 'center', alignItems: 'center', padding: 30}}>
                <Text style={[styles.text1,{fontSize:20}]}>{language.promotions.ready_set_promote(selectedLanguage)}</Text>
                </View>

                <ScrollView style={{flex:1}}>

                    <View style={styles.menuTabs}>
                        <View style={{flexDirection:'column'}}>
                          <Text style={styles.text2}>{language.promotions.ready_set_promote(selectedLanguage)}</Text>
                        </View>
                        <Text style={styles.text2}>{this.state.potentialAud}</Text>
                    </View>

                    <View style={styles.menuTabs}>
                        <View style={{flexDirection:'column'}}>
                          <Text style={styles.text2}>{language.promotions.duration(selectedLanguage)} & Budget</Text>
                        </View>
                        <Text style={styles.text2}>${this.state.totalPrice}/{this.state.days} {language.promotions.days(selectedLanguage)}</Text>
                    </View>

                    <View style={styles.menuTabs}>
                        <View style={{flexDirection:'column'}}>
                          <Text style={styles.text2}>{language.promotions.estimate_reach(selectedLanguage)}</Text>
                        </View>
                        <Text style={styles.text2}>{this.state.estimateReached}</Text>
                    </View>

                    <View style={[styles.menuTabs,{paddingTop:25,paddingBottom:25,flexDirection:'column',alignItems:'center'}]}>
                        <Text style={styles.text2}>{language.promotions.promotion_cost_title(selectedLanguage)}</Text>
                        <Text style={{color: '#000000',fontFamily: 'Poppins-Medium',fontSize: 20}}>${this.state.totalPrice}</Text>
                    </View>

                    <View style={[styles.menuTabs,{padding:10}]}>
                      <Image style={{marginLeft:5,height:40,width:60,padding:10,borderRadius:5}} source={require('../images/card-template.png')}/>

                      <Text style={[styles.text2,{numberOfLines:2,flex:1,fontSize:10}]}>{language.promotions.wallet_balance(selectedLanguage,this.state.userBalance)}</Text>

                      <TouchableOpacity onPress={() => this.props.navigation.navigate('AddFunds',{navigation:this.props,userId: this.state.userid,onSelect: this.onSelect})}>
                        <View style={styles.addFunds}>
                          <FontAwesome5 name="fingerprint" color="#ffff" size={14} />
                          <Text style={styles.addFundsBtn}>{language.promotions.add_funds(selectedLanguage)}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={[styles.menuTabs,{padding:10,}]}>
                      <Text style={[styles.text2,{textAlign:'center',numberOfLines:2,flex:1,fontSize:10}]}>{language.promotions.promotion_guide(selectedLanguage)}</Text>
                    </View>
                </ScrollView>

                <View style={styles.submitBtn}>
                  <TouchableOpacity onPress={()=>this.onPaymentRequest()}>
                      <View style={styles.buttonTab}>
                        <Text style={{fontFamily: 'Poppins-Medium', color: '#ffff'}}>{language.promotions.create_promotion(selectedLanguage)}</Text>
                      </View>
                  </TouchableOpacity>
                </View>

              </View>

          </Swiper>

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({

  addFundsBtn: {
    fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    color: '#ffffff',
    // marginTop: 75,
    marginLeft: 8,
    fontSize: 10
  },

  addFunds: {
    width: 99,
    height: 34,
    shadowColor: '#000',
     shadowOffset: { width: 6, height: 0 },
    shadowRadius: 19,
    borderRadius: 25,
    backgroundColor: '#fb0201',
    elevation: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    marginTop:25,
    flexDirection:'column'

  },
  wrapper:{
    marginTop:20
  },

  searchSection: {
    justifyContent: "center",
    alignItems:'center',
    width: '90%',
    height: 41,
    flexDirection: "row",
    shadowColor: "rgba(0, 0, 0, 0.35)",
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 7,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderColor:'#eeeeee',
    borderWidth: 1,
    elevation:5,
    paddingLeft:5,
    paddingRight:5,
  },
  wrapper:{
    marginTop:20
  },

  searchSection: {
    justifyContent: "center",
    alignItems:'center',
    width: '90%',
    height: 41,
    flexDirection: "row",
    shadowColor: "rgba(0, 0, 0, 0.35)",
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 7,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderColor:'#eeeeee',
    borderWidth: 1,
    elevation:5,
    paddingLeft:5,
    paddingRight:5,
  },
  wrapper:{
    marginTop:20
  },

  searchSection: {
    justifyContent: "center",
    alignItems:'center',
    width: '90%',
    height: 41,
    flexDirection: "row",
    shadowColor: "rgba(0, 0, 0, 0.35)",
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 7,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderColor:'#eeeeee',
    borderWidth: 1,
    elevation:5,
    paddingLeft:5,
    paddingRight:5,
  },
  submitBtn:{
    //flex:1,
    width:'100%',
    position: 'relative',
    marginBottom: Platform.OS==='android' ? 0 : 20,
  },
  slide1:{


  },
  buttonTab:{
    height: 50,
    backgroundColor: '#fb0201',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu:{
    padding: 10,
    flexDirection: 'row',
    // marginRight: 10,
  },
  text1: {
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 30
  },
  menuTabs: {
   minHeight: 47,
   borderColor: '#eeeeee',
   borderStyle: 'solid',
   borderWidth: 1,
   backgroundColor: '#ffffff',
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   //marginRight: 10,

 },
  text2: {
    color: '#707070',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    marginLeft:10,
    marginRight:10
  },
  topHeader:{
    marginTop: 40,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
  },
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: { width: 3, height: 0 },
    elevation: 5,
  },

  title: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  },

  arrowback: {
    color: '#000'
  },
  arrowfront: {
    color: '#000',
    marginRight: 15,
  },
  headerArrow: {
    flex: 1,

  },
  searchIcon:{
    alignItems:'flex-end',
  },

  headerTitle: {
    flex: 2,
    marginLeft: 35,
    //alignItems: 'center',
  justifyContent: 'center',

},checkBoxSelected:{
  borderColor:'red',
  borderWidth:1,
  padding:3,
  borderRadius:1,
  alignItems:'center',
  justifyContent:'center'
},
checkBoxDeSelected:{
  borderColor:'#fccccc',
  borderWidth:1,
  padding:3,
  borderRadius:1,
  alignItems:'center',
  justifyContent:'center'
},
shdowBox:{
  borderWidth: 1,
    width:'80%',
    height:80,
    borderRadius: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    padding:20
},customThumb:{
  height:20,
  width:20,
  backgroundColor:'white',
  borderColor:'red',
  borderWidth:3,
  borderRadius:10
}

});
const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  username: state.profilepicture.username,
});

export default connect(
  mapStateToProps,
  {viewActivityStream, clearActivityStream},
)(ChooseAudience);
