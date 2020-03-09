import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import Toast from 'react-native-root-toast';
import {apiurl, imageurl} from '../constants/config';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

export default class ReCreatePromotion extends Component {

  constructor(props){
    super(props);
    const { navigation } = this.props;
    const user_id = navigation.getParam('user_id', 'NO-ID');
    const promotion_id = navigation.getParam('promotion_id', 'NO-ID');
    console.log("user_id : " + user_id);
    console.log("promotion_id : " + promotion_id);
    this.state = {
      user_id,
      promotion_id,
      fetchSuccess:false,
      userBalance:0,
      isLoading:true,
    }
    this.getPromotionDetails(promotion_id,user_id);
    this.getWalletBalance(user_id);
  }

  componentDidMount() {
      this.props.navigation.setParams({onChange: this.onChange});

  }

  getWalletBalance(user_id) {
    fetch(apiurl + 'fetch-user-balance.php?user_id=' + this.state.user_id, {
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

  getPromotionDetails(promotion_id,user_id) {
    fetch(apiurl+`fetch-single-promotion.php?promotion_id=${promotion_id}&user_id=${user_id}`, {
              method: 'GET',
              headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            this.setState({
              isLoading:false,
            });
            return response.json();
          })
          .then((responseJson) => {
            console.log("---------------------- DATA SINGLE PROMOTION--------------------");
            console.log(responseJson);

            if(responseJson.status == 'success'){
              if(responseJson.hasOwnProperty('data')){

                const post_id = responseJson.data.post_id;
                const duration = responseJson.data.duration;
                const total_budget = responseJson.data.promotion_cost;
                const age = responseJson.data.min_age + '-' + responseJson.data.max_age;
                const minAge = responseJson.data.min_age;
                const maxAge = responseJson.data.max_age;
                const location = responseJson.data.locations;
                const tag_set = responseJson.data.promotion_interests;
                const gender_set = responseJson.data.gender;

                const budget_per_day = responseJson.data.budget_per_day;
                const est_reach = this.calculateEstReach(budget_per_day,duration);

                this.setState({
                  data:responseJson.data,
                  post_id,
                  duration,
                  total_budget,
                  age,
                  location,
                  tag_set,
                  gender_set,
                  fetchSuccess:true,
                  budget_per_day,
                  minAge,
                  maxAge,
                  est_reach,
                });

              }else{
                console.log("data block not found");
                this.showToast("Error in fetching data, Please try again.");
              }

            }else{
              console.log("Status success not found");
              this.showToast("Error in fetching data, Please try again.");
            }
            return responseJson.data;
          })
          .catch((error) => {
            console.error(error);
            this.showToast("Error in fetching data, Please try again.");
            this.setState({
              isLoading:false,
            });
          });
  }

  calculateEstReach(price,days){
    try{
      console.log("Price : ",price);
      console.log("Days : ",days);
      var x = price * days;
      var y = (x/5)*1000;
      console.log("Number Of Reached : " + y)
      return y;
    }catch(err){
      console.log("Catch block execute Est_reach: ",err);
      return 0;
    }
  }

  showToast(msg){
    Toast.show(msg, {
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

  addPromotion() {
    this.setState({isLoading:true,});
    try{
        const {
          user_id,
          post_id,
          duration,
          total_budget,
          age,
          location,
          tag_set,
          gender_set,
          fetchSuccess,
          budget_per_day,
          minAge,
          maxAge,
          est_reach,
          userBalance,
        } = this.state;

        console.log("================ Add Promotion ================");
        console.log("user_id : " + user_id);
        console.log("post_id : " + post_id);
        console.log("duration : " + duration);
        console.log("total_budget : " + total_budget);
        console.log("age : " + age);
        console.log("location : " + location.toString());
        var locationStr = '';
        for (var i=0; i < location.length; i++) {
          locationStr = locationStr + location[i]  + "&" ;
        }
        if(locationStr!=''){
          locationStr = locationStr.substring(0, locationStr.length-1);
        }
        console.log("locationString : " + locationStr);
        console.log("tag_set : " + tag_set.toString());
        console.log("gender_set : " + gender_set.toString());

        fetch(apiurl + 'add-promotion.php', {
                  method: 'POST',
                  headers: {
                  "Accept": "application/json",
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  user_id: user_id,
                  post_id: post_id,
                  duration: duration,
                  total_budget: total_budget,
                  age: `${minAge},${maxAge}`,
                  location: locationStr,
                  tag_set: tag_set.toString(),
                  gender_set: gender_set.toString(),
                })
              })
              .then((response) => {
                this.setState({
                  isLoading:false,
                });
                return response.json();
              })
              .then((responseJson) => {
                console.log("---------------------- DATA --------------------");
                console.log(responseJson);
                if(responseJson.status == 'success' || responseJson.status == 'success'){
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
                  console.log("---------------------- DATA1 --------------------");
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
                return responseJson.data;
              })
              .catch((error) => {
                console.log("---------------------- DATA2 --------------------");
                console.error(error);
              });
        }catch(err){
          this.setState({
            isLoading:false,
          });
        }
  }

  onChange = data => {
    console.log("--------- onChange Called : ",);
    this.addPromotion();
  }

  onSelect = data => {
    console.log("Re-Create Promotion onSelectCalls");
    this.getWalletBalance();
  };



  render() {
    const {
      user_id,
      post_id,
      duration,
      total_budget,
      age,
      location,
      tag_set,
      gender_set,
      fetchSuccess,
      budget_per_day,
      minAge,
      maxAge,
      est_reach,
      userBalance,
      isLoading
    } = this.state;

    if(!isLoading){
      if(fetchSuccess){
        return (
          <View style={styles.container}>

            <ScrollView style={{flex:1,}} contentContainerStyle={{alignItems:'center'}}>

              <View style={styles.cardView}>
                <TextView style={styles.title} text='Cost & Duration' />
                <View style={{margin:10}}>
                  <Text style={styles.itemHeading}>{`Total Budget : ${total_budget}`}</Text>
                  <Text style={styles.itemHeading}>{`Total Duration : ${duration}`}</Text>
                  <Text style={styles.itemHeading}>{`Budget per day : ${budget_per_day}`}</Text>
                </View>
              </View>

              <View style={styles.cardView}>
                <TextView style={styles.title} text='Age range' />
                <View style={{margin:10}}>
                  <Text style={styles.itemHeading}>{`Min Age : ${minAge}`}</Text>
                  <Text style={styles.itemHeading}>{`Max Age : ${maxAge}`}</Text>
                </View>
              </View>

              <View style={styles.cardView}>
                <TextView style={styles.title} text='Added locations' />
                <View style={{margin:10}}>
                <FlatList
                  data={location}
                  horizontal={false}
                  keyExtractor={item => item}
                  renderItem={({item,index}) => (
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <FontAwesome5 name="map-marker-alt" color="#F00" />
                      <Text style={[styles.itemHeading,{marginLeft:10}]}>{item}</Text>
                    </View>
                  )}
                  />
                </View>
              </View>

              <View style={styles.cardView}>
                <TextView style={styles.title} text='Added categories' />
                <View style={{margin:10}}>
                <FlatList
                  data={tag_set}
                  horizontal={false}
                  keyExtractor={item => item}
                  renderItem={({item,index}) => (
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <FontAwesome5 name="skiing" color="#F00" />
                      <Text style={[styles.itemHeading,{marginLeft:10}]}>{item}</Text>
                    </View>
                  )}
                  />
                </View>
              </View>

              <View style={styles.cardView}>
                <TextView style={styles.title} text='Gender' />
                <View style={{margin:10}}>
                <FlatList
                  data={gender_set}
                  horizontal={false}
                  keyExtractor={item => item}
                  renderItem={({item,index}) => (
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <FontAwesome5 name="venus-mars" color="#F00" />
                      <Text style={[styles.itemHeading,{marginLeft:10}]}>{item}</Text>
                    </View>
                  )}
                  />
                </View>
              </View>

              <View style={[styles.cardView,{alignItems:'center'}]}>
                <TextView style={[styles.title,{color:'black'}]} text='Estimate reach' />
                <View style={{margin:8}}>
                  <Text style={[styles.title,{fontSize:22}]}>{est_reach}</Text>
                </View>
              </View>

              <View style={[styles.cardView,{alignItems:'center'}]}>
                <TextView style={[styles.title,{color:'black'}]} text='Total spends' />
                <View style={{margin:8}}>
                  <Text style={[styles.title,{fontSize:22}]}>{`$${total_budget} over ${duration} days`}</Text>
                </View>
              </View>

              <View style={[styles.cardView,{alignItems:'center'}]}>
                <TextView style={[styles.title,{color:'black'}]} text='This promotion will cost you a total of' />
                <View style={{margin:8}}>
                  <Text style={[styles.title,{fontSize:22}]}>{`$${total_budget}`}</Text>
                </View>
              </View>

              <View style={[styles.menuTabs,{padding:10}]}>
                <Image style={{marginLeft:5,height:40,width:60,padding:10,borderRadius:5}} source={require('../images/card-template.png')}/>

                <Text style={[styles.text2,{numberOfLines:2,fontSize:10}]}>{`You currently have $${userBalance} USD in wallet`}</Text>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('AddFunds',{navigation:this.props,userId: user_id,onSelect: this.onSelect})}>
                  <View style={styles.addFunds}>
                    <FontAwesome5 name="fingerprint" color="#ffff" size={14} />
                    <TextView style={styles.addFundsBtn} text='ADD FUNDS' />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.menuTabs,{padding:10,}]}>
                <TextView style={[styles.text2,{textAlign:'center',numberOfLines:2,fontSize:10}]} text={`By creating this promotion you have agreed to Woodlig's Advertising & Promotion Guidelines.`} />
              </View>

              <View style={styles.submitBtn}>
                <TouchableOpacity onPress={()=>this.addPromotion()}>
                    <View style={styles.buttonTab}>
                      <TextView style={{fontFamily: 'Poppins-Medium', color: '#ffff'}} text={`RE-CREATE PROMOTION`} />
                    </View>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        );
      }else{
        return (
        <View style={[styles.container,{justifyContent:'center',alignItems:'center'}]}>
          <TextView text='Something went wrong please try again' />
        </View>
      )}
    }else{
      return(
        <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
          <ActivityIndicator size="large" color="#fb0201" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    elevation: 5
  },

  title: {
    color: '#F00',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  },itemHeading: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },

  arrowback: {
    color: '#000'
  },

  headerArrow: {
    flex: 1
  },

  headerTitle: {
    flex: 2,
    marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center'
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

  addFundsBtn: {
    fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    color: '#ffffff',
    // marginTop: 75,
    marginLeft: 8,
    fontSize: 10
  },

  addFunds2: {
    width: 99,
    height: 34,
    shadowColor: '#000',
    // shadowOffset: { width: 6, height: 0 },
    shadowRadius: 19,
    borderRadius: 25,
    backgroundColor: '#fb0201',
    elevation: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },textInputStyle:{
    color:'black'
  },
  cardView: {
      flexDirection: 'column',
      padding: 10,
      marginLeft:10,
      marginRight:10,
      marginTop: 8,
      marginBottom: 8,
      borderRadius: 5,
      backgroundColor: '#FFF',
      elevation: 7,
      width:'90%',
      shadowOffset:{  width: 0,  height: 0,  },
      shadowColor: 'gray',
      shadowOpacity: 0.3,
  },menuTabs: {
   minHeight: 47,
   borderColor: '#eeeeee',
   borderStyle: 'solid',
   borderWidth: 1,
   backgroundColor: '#ffffff',
   flexDirection: 'row',
   alignItems: 'center',
   //marginRight: 10,

 },text2: {
   color: '#707070',
   fontFamily: 'Poppins-Medium',
   fontSize: 13,
   marginLeft:10,
   marginRight:10
 },submitBtn:{
   width:'100%',
   position: 'relative',
   marginBottom: Platform.OS==='android' ? 0 : 20,
 },buttonTab:{
   height: 50,
   backgroundColor: '#fb0201',
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
 },
});
