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
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fontelloConfig from '../config.json';
import WalletPromotion from '../components/WalletPromotion';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import language from "../constants/language.js"
import {apiurl, imageurl} from '../constants/config';

import { Avatar } from 'react-native-paper';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import Pie from 'react-native-pie';

import * as Progress from 'react-native-progress';

const Customon = createIconSetFromFontello(fontelloConfig);
export default class PromotionsInsights extends Component {

  constructor(props){
    super(props);

    const { navigation } = this.props;
    const promotion_id = navigation.getParam('promotion_id');
    const user_id = navigation.getParam('user_id');
    const postid = navigation.getParam('postid');
    const post_data = navigation.getParam('post_data');
    console.log("Data Receive :");
    console.log("user_id : ",user_id);
    console.log("postid : ",postid);
    console.log("promotion_id : " , promotion_id);
    console.log("post_data : " , post_data);

    this.state = {
      viewMore:false,
      viewData:[],
      viewLable:[],
      reachData:[],
      reachLable:[],
      genderSeries:[],
      genderColour:[],
      genderTextSlice:[],
      promotionState:'',
      selectedLanguage:'en',
      user_id,
      post_data,
      promotion_id,
    }
    this.getPromotionDetails(promotion_id);
  }

  getPromotionDetails(promotion_id) {
    fetch(apiurl+`fetch-promotion-insights.php?promotion_id=${promotion_id}&user_id=${this.state.user_id}`, {
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
              if(responseJson.hasOwnProperty('data')){
                this.setState({
                  promotionData:responseJson.data,
                  promotionState:responseJson.data.promotion_status,
                });
                this.getViewCountArray(responseJson.data.views_data);
                this.getReachCountArray(responseJson.data.reach_data);
                this.getGenderCountArray(responseJson.data.gender_analytics);
              }else{
                console.log("data block not found");
              }

            }else{
              console.log("Status success not found");
            }
            return responseJson.data;
          })
          .catch((error) => {
            console.error(error);
          });
  }

  changePromotionStatus(status) {
    const {user_id,promotion_id} = this.state;
    console.log("Status : ",status);
    console.log("promotion_id : ", promotion_id);
    console.log("user_id : ", user_id);

    var str = '';
    if(status == 1){
      str = `${apiurl}update-promotion-status.php?promotion_id=${promotion_id}&user_id=${user_id}&pause_promotion=1`;
    }else if(status == 2){
      str = `${apiurl}update-promotion-status.php?promotion_id=${promotion_id}&user_id=${user_id}&resume_promotion=1`;
    }else if(status == 3){
      str = `${apiurl}update-promotion-status.php?promotion_id=${promotion_id}&user_id=${user_id}&terminate_promotion=1`;
    } else if(status == 4){
      str = `${apiurl}update-promotion-status.php?promotion_id=${promotion_id}&user_id=${user_id}&delete_promotion=1`;
    }
    console.log("Calling api : ", str);
    fetch(str, {
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
              if(status == 1){
                this.setState({promotionState:'Paused'})
              }else if( status == 2){
                this.setState({promotionState:'Active'})
              }else if( status == 3){
                this.setState({promotionState:'Cancelled'})
              }else if(status == 4){

              }
              try{
                const { navigation } = this.props;
                navigation.goBack();
                navigation.state.params.onSelect();
              }catch(err){
                console.log("Error : ",err);
              }
              // if(responseJson.hasOwnProperty('data')){
              //   this.setState({
              //     promotionData:responseJson.data,
              //     promotionState:responseJson.data.promotion_status,
              //   });
              //   this.getViewCountArray(responseJson.data.views_data);
              //   this.getReachCountArray(responseJson.data.reach_data);
              //   this.getGenderCountArray(responseJson.data.gender_analytics);
              // }else{
              //   console.log("data block not found");
              // }

            }else{
              console.log("Status success not found");
            }
            return responseJson.data;
          })
          .catch((error) => {
            console.error(error);
          });
  }

  getViewCountArray(array){
    var viewData = [];
    var viewLable = [];

  	for(let i = 0; i < array.length; i++){
      console.log(array[i].count);
  		viewData.push(
        array[i].count
      );
      if(i==0 || i == array.length - 1){
        viewLable.push(
          array[i].date
        );
      }else{
        viewLable.push(
          ''
        );
      }
  	}
    console.log('View Data',viewData);
    console.log('View Lable',viewLable);

    this.setState({viewData:viewData,viewLable:viewLable});
  }

  getReachCountArray(array){
    var reachData = [];
    var reachLable = [];

  	for(let i = 0; i < array.length; i++){
      console.log(array[i].count);
  		reachData.push(
        array[i].count
      );
      if(i==0 || i == array.length - 1){
        reachLable.push(
          array[i].date
        );
      }else if(reachLable.length<3){
        reachLable.push(
          ''
        );
      }
  	}
    console.log('Reach Data',reachData);
    console.log('Reach Lable',reachLable);
    this.setState({reachData:reachData,reachLable:reachLable});
  }

  getGenderCountArray(array){
    series = [];
    colorArr = [];
    sliceArr = [];
    for(let i = 0; i < array.length; i++){
      var obj = {}
  		series.push(parseInt(array[i].percentage, 10));
      if(array[i].gender == 'male'){
        colorArr.push('#CE93D8');
        obj = {text:'male',colour:'#CE93D8'};
      }else if(array[i].gender == 'female'){
        colorArr.push('#FFAB91');
        obj = {text:'female',colour:'#FFAB91'};
      }else if(array[i].gender == 'non-binary'){
        colorArr.push('#B0BEC5');
        obj = {text:'non-binary',colour:'#B0BEC5'};
      }else if(array[i].gender == 'transgender'){
        colorArr.push('#80DEEA');
        obj = {text:'transgender',colour:'#80DEEA'};
      }else if(array[i].gender == 'genderfluid'){
        colorArr.push('#757575');
        obj = {text:'genderfluid',colour:'#757575'};
      }else if(array[i].gender == 'other'){
        colorArr.push('#E6EE9C');
        obj = {text:'other',colour:'#E6EE9C'};
      }
      sliceArr.push(obj);
  	}
    console.log("Series : ",series);
    console.log("Colour Series : ",colorArr);
    console.log("Slice Arr : ",sliceArr);
    this.setState({genderSeries:series,genderColour:colorArr,genderTextSlice:sliceArr});
  }
  changeLang(){
    const {selectedLanguage} = this.state;
    if(selectedLanguage == 'fr'){
      this.setState({selectedLanguage:'en'});
    }else{
      this.setState({selectedLanguage:'fr'});
    }
  }

  _reCreatePromotion(){
    const {user_id,promotion_id} = this.state;
    console.log("----- reCreate user_id : ",user_id);
    console.log("----- reCreate promotion_id : ",promotion_id);
    this.props.navigation.navigate("ReCreatePromotion",{user_id,promotion_id});
  }

  render() {
    const {selectedLanguage,post_data,promotion_id,user_id} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
            <FontAwesome5 style={styles.arrowback} name="arrow-left" size={15} />
          </TouchableOpacity>
          <Text style={styles.title}>{language.promotions.promotion_insights(selectedLanguage)}</Text>
          <TouchableOpacity onPress={()=>this.changeLang()}>
            <Avatar.Image size={38} source={ post_data!=undefined && post_data.profile_thumb == null ? require('../images/ic_account_circle_red_24px.jpg') : { uri: `${imageurl}/${post_data.profile_thumb}`}} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.headerBg}>
            <Image style={{ height: 196, borderRadius:10,padding:5,margin:5 }} source={ post_data!=undefined && post_data.path == null ? require('../images/ic_account_circle_red_24px.jpg') : { uri: `${imageurl}/${post_data.path}`}}  />
          </View>
          <View style={styles.headerBgCaption}>
            <Text style={styles.headerBgCaptionText}>{ this.state.promotionData!=undefined ? this.state.promotionData.posts_data.caption : '' }</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <TouchableOpacity
            onPress={()=>this.props.navigation.navigate('PostDetails', {
              type:post_data.type,
              postid:post_data.post_id,
              profile_thumb:post_data.profile_thumb,
            })}>
              <View style={[styles.addFunds2,{width:200 }]}>
                <Text style={styles.addFundsBtn}>{language.promotions.view_original_post(selectedLanguage)}</Text>
                <FontAwesome5 name="arrow-right" color="#ffff" size={9} style={{ paddingLeft: 10 }} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>

            <View style={styles.gridContent1}>
              <Text style={styles.gridTextSmall}>{language.promotions.elapsed_time(selectedLanguage)}</Text>
              <Text style={styles.gridTextBig}>{ this.state.promotionData!=undefined ? this.state.promotionData.elapsed_date : '' } days</Text>
            </View>
            <View style={styles.gridContent1}>
              <Text style={styles.gridTextSmall}>{language.promotions.remaining_time(selectedLanguage)}</Text>
              <Text style={styles.gridTextBig}>{ this.state.promotionData!=undefined ? this.state.promotionData.remaining_days : '' } days</Text>
            </View>
            <View style={styles.gridContent2}>
              <Text style={styles.gridTextSmall}>{language.promotions.spent(selectedLanguage)}</Text>
              <Text style={[styles.gridTextBig, styles.spent]}>${ this.state.promotionData!=undefined ? this.state.promotionData.spent : '' }</Text>
              <Text style={styles.spent2}>{language.promotions.of_budget(selectedLanguage,12.05)}</Text>
            </View>
          </View>

          {this.state.promotionState == 'Active' ? (
              <View style={{
                flexDirection: 'row', justifyContent: 'center',
                alignItems: 'center', marginTop: 15, paddingBottom: 10,
                borderBottomWidth: 1, borderBottomColor: '#dedede'
              }}>
                <Text style={styles.status1}> {language.promotions.promotion_status(selectedLanguage)} </Text>
                <Text style={[styles.status2,{color:'#11daaa',fontFamily: 'Poppins-Bold',}]}> { this.state.promotionState } </Text>
              </View>
          ):(null)}

          {this.state.promotionState == 'Paused' ? (
              <View style={{
                flexDirection: 'row', justifyContent: 'center',
                alignItems: 'center', marginTop: 15, paddingBottom: 10,
                borderBottomWidth: 1, borderBottomColor: '#dedede'
              }}>
                <Text style={styles.status1}> {language.promotions.promotion_status(selectedLanguage)} </Text>
                <Text style={[styles.status2,{color:'#d8b142',fontFamily: 'Poppins-Bold',}]}> { this.state.promotionState } </Text>
              </View>
          ):(null)}

          {this.state.promotionState == 'Completed' ? (
              <View style={{
                flexDirection: 'row', justifyContent: 'center',
                alignItems: 'center', marginTop: 15, paddingBottom: 10,
                borderBottomWidth: 1, borderBottomColor: '#dedede'
              }}>
                <Text style={styles.status1}> {language.promotions.promotion_status(selectedLanguage)} </Text>
                <Text style={[styles.status2,{color:'#f17679',fontFamily: 'Poppins-Bold',}]}> { this.state.promotionState } </Text>
              </View>
          ):(null)}

          {this.state.promotionState == 'Cancelled' ? (
              <View style={{
                flexDirection: 'row', justifyContent: 'center',
                alignItems: 'center', marginTop: 15, paddingBottom: 10,
                borderBottomWidth: 1, borderBottomColor: '#dedede'
              }}>
                <Text style={styles.status1}> {language.promotions.promotion_status(selectedLanguage)} </Text>
                <Text style={[styles.status2,{color:'#F00',fontFamily: 'Poppins-Bold',}]}> Cancelled </Text>
              </View>
          ):(null)}

          <View style={{justifyContent: 'center',alignItems: 'center', marginTop: 15, paddingBottom: 10,}}>
            <Text style={styles.gridTextBig}> Impressions </Text>
            <Text style={styles.gridTextBig}> { this.state.promotionData!=undefined ? this.state.promotionData.impressions : '' } </Text>
            <View style={styles.impressionIcons}>
              <View>
                <FontAwesome5 name="heart" color='#fb0201' size={19}
                  style={{ paddingLeft: 6, marginBottom: 13 }} />
                <Text style={styles.gridTextBig}>{ this.state.promotionData!=undefined ? this.state.promotionData.active_promotion_like_count : '' }</Text>
              </View>

              <View style={{marginLeft:30}}>
                <FontAwesome5 name="share-alt" color='#fb0201' size={19}
                  style={{ paddingLeft: 6, marginBottom: 13 }} />
                <Text style={styles.gridTextBig}>{ this.state.promotionData!=undefined ? this.state.promotionData.promotion_shares_count : '' }</Text>
              </View>
              {
              // <View>
              //   <FontAwesome5 name="link" color='#fb0201' size={19}
              //     style={{ paddingLeft: 10, marginBottom: 13 }} />
              //   <Text style={styles.gridTextBig}>{ this.state.promotionData!=undefined ? this.state.promotionData.shares_count : '' }</Text>
              // </View>
             }

            </View>
          </View>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center', marginTop: 15,
            borderTopWidth: 1, borderTopColor: '#dedede',
            marginTop:10,paddingTop:10
          }}>
            <Text style={styles.gridTextBig}> {language.promotions.views(selectedLanguage)} </Text>
            <Text style={styles.gridTextBig}> { this.state.promotionData!=undefined ? this.state.promotionData.views_count : '' } </Text>
          </View>

          {this.state.viewData.length>1 ? (
            <LineChart
              data={{
                labels: this.state.viewLable,
                datasets: [
                  {
                    data: this.state.viewData,
                    strokeWidth: 3,
                    color: (opacity = 1) => `rgba(255, 0, 0, 1)`,
                  },
                ],
              }}
              withDots={false}
              width={Dimensions.get('window').width - 10}
              height={220}
              chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, 0.7)`,
                  strokeWidth: 1,
                  style: {
                    borderRadius: 16,
                  },
                }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          ) : (
            <View style={{justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 10, height:220 }}>
            <Text>{language.promotions.no_view_data(selectedLanguage)}</Text>
            </View>
          )}

          <View style={{
            justifyContent: 'center',
            alignItems: 'center', marginTop: 15,
            borderTopWidth: 1, borderTopColor: '#dedede',
            marginTop:10,paddingTop:10
          }}>
            <Text style={styles.gridTextBig}> {language.promotions.reach(selectedLanguage)} </Text>
            <Text style={styles.gridTextBig}> { this.state.promotionData!=undefined ? this.state.promotionData.reach_count : '' } </Text>
          </View>

          {this.state.reachData.length>1 ? (
            <BarChart
              data={{
                labels: this.state.reachLable,
                datasets: [
                  {
                    data: this.state.reachData,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 10}
              height={220}
              chartConfig={{
                backgroundColor: '#FFF',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 0, 0, 1)`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, 0.7)`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          ) : (
            <View style={{justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 10, height:220 }}>
            <Text>{language.promotions.no_reach_data(selectedLanguage)}</Text>
            </View>
          )}



          {!this.state.viewMore ? (
            <TouchableOpacity onPress={()=>this.setState({viewMore:true})} style={{
              justifyContent: 'center',
              alignItems: 'center', marginTop: 15,
              borderTopWidth: 1, borderTopColor: '#dedede',
              marginTop:10,paddingTop:10
            }}>
              <Text style={[styles.gridTextBig,{color:'#037ED9'}]}>{language.promotions.view_more_analytics(selectedLanguage)}</Text>
            </TouchableOpacity>
          ) : (
            <View>
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center', marginTop: 15,
                    borderTopWidth: 1, borderTopColor: '#dedede',
                    marginTop:10,paddingTop:10
                  }}>
                    <Text style={styles.gridTextBig}> {language.promotions.gender(selectedLanguage)} </Text>
                  </View>

                  {this.state.genderSeries.length>0 ? (
                    <View style={{flexDirection:"row",marginTop:20,marginLeft:20}}>

                        <View>
                          <Pie
                            radius={80}
                            innerRadius={45}
                            series={this.state.genderSeries}
                            colors={this.state.genderColour}
                            backgroundColor='#ddd' />
                          <View style={styles.gauge}>
                          <FontAwesome5 name="percentage" color='rgba(50, 50, 50, 1)' size={40} />
                          </View>
                        </View>

                        <View style={{marginLeft:20,height:160,justifyContent:'center'}}>

                        <FlatList
                          data={this.state.genderTextSlice }
                          renderItem={({item,index}) => (
                            <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                              <View style={{backgroundColor:item.colour,borderRadius:50,height:15,width:15}}/>
                              <Text style={{marginLeft:10}}>{item.text}</Text>
                            </View>
                          )}/>

                        </View>
                    </View>
                  ) : (
                    <View>
                    </View>
                  )}

                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center', marginTop: 15,
                    borderTopWidth: 1, borderTopColor: '#dedede',
                    marginTop:10,paddingTop:10
                  }}>
                    <Text style={styles.gridTextBig}>{language.promotions.age(selectedLanguage)} & {language.promotions.locations(selectedLanguage)}</Text>
                  </View>

                  <View style={{alignItems:'center',justifyContent:'center',margin:20}}>
                      <FlatList
                        data={ this.state.promotionData!=undefined ? this.state.promotionData.age_group_analytics : [] }
                        style={{marginTop:10}}
                        renderItem={({item,index}) => (
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:5}}>
                            <Text style={{marginRight:10}}>{item.age}</Text>
                            <View>
                              <Progress.Bar
                                  color='red'
                                  progress={parseInt(item.percentage, 10) / 100}
                                  width={250}
                                  unfilledColor="#F2F2F2"
                                  borderWidth={0}/>
                            </View>
                          </View>
                        )}/>
                  </View>

                  <View style={{marginTop:10,marginBottom:10,alignItems:'center'}}>

                      <Text>Top 5</Text>
                      <FlatList
                        data={this.state.promotionData!=undefined ? this.state.promotionData.location_analytics : []}
                        style={{marginTop:10}}
                        renderItem={({item,index}) => (
                            <View style={{marginTop:10}}>
                              <Text style={{color:'black'}}>{item.location} - {item.percentage}%</Text>
                            </View>
                        )}/>
                  </View>

                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopWidth: 1, borderTopColor: '#dedede',
                    marginTop:10,paddingTop:10
                  }}>
                    <Text style={styles.gridTextBig}> {language.promotions.categories(selectedLanguage)} </Text>
                  </View>

                  <View style={{marginTop:10,marginBottom:10,alignItems:'center'}}>
                      <FlatList
                        data={this.state.promotionData!=undefined ? this.state.promotionData.category_analytics : []}
                        renderItem={({item,index}) => (
                            <View style={{marginTop:10}}>
                              <Text style={{color:'black'}}>{item.skill} - {item.percentage}%</Text>
                            </View>
                        )}/>
                  </View>
            </View>
          )}

        {this.state.promotionState == 'Active' ? (
            <TouchableOpacity onPress={()=>this.changePromotionStatus(1)} style={{
              justifyContent: 'center',
               marginTop: 15,
              borderTopWidth: 1, borderTopColor: '#dedede',
              marginTop:10,paddingTop:10
            }}>
              <Text style={styles.gridTextBig}>{language.promotions.pause_promotion(selectedLanguage)}</Text>
            </TouchableOpacity>
        ) : (null)}

        {this.state.promotionState == 'Paused' ? (
            <TouchableOpacity onPress={()=>this.changePromotionStatus(2)} style={{
              justifyContent: 'center',
               marginTop: 15,
              borderTopWidth: 1, borderTopColor: '#dedede',
              marginTop:10,paddingTop:10
            }}>
              <Text style={styles.gridTextBig}>{language.promotions.resume_promotion(selectedLanguage)}</Text>
            </TouchableOpacity>
        ) : (null)}

        {this.state.promotionState != 'Completed' && this.state.promotionState != 'Cancelled' ? (
            <TouchableOpacity onPress={()=>this.changePromotionStatus(3)} style={{
              justifyContent: 'center',
               marginTop: 15,
              borderTopWidth: 1, borderTopColor: '#dedede',
              marginTop:10,paddingTop:10
            }}>
              <Text style={styles.gridTextBig}>{language.promotions.terminate_promotion(selectedLanguage)}</Text>
            </TouchableOpacity>
        ) : (null)}

        {this.state.promotionState != 'Completed' && this.state.promotionState != 'Cancelled' ? (
            <TouchableOpacity onPress={()=>this.changePromotionStatus(4)} style={{
              justifyContent: 'center',
               marginTop: 15,
              borderTopWidth: 1, borderTopColor: '#dedede',
              marginTop:10,paddingTop:10, marginBottom:20
            }}>
              <Text style={[styles.gridTextBig,{color:'red'}]}>{language.promotions.delete_promotion(selectedLanguage)}</Text>
            </TouchableOpacity>
        ) : (null)}

        {this.state.promotionState == 'Completed' || this.state.promotionState == 'Cancelled' ? (
            <TouchableOpacity onPress={()=>this._reCreatePromotion()} style={{
              justifyContent: 'center',
               marginTop: 15,
              borderTopWidth: 1, borderTopColor: '#dedede',
              marginTop:10,paddingTop:10,marginBottom:20
            }}>
            <Text style={styles.gridTextBig}>{language.promotions.reactive_promotion(selectedLanguage)}</Text>
            </TouchableOpacity>
        ) : (null)}

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  impressionIcons: {
    marginTop: 15,
    width: 150,
    height: 81,
    shadowOpacity:1,
    shadowColor: 'rgba(0, 0, 0, 0.23)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 5,
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  headerBg: {
    marginTop: 0

  },
  spent: {
    color: '#fb0201',
  },

  spent2: {

    color: '#d4af37',
    fontFamily: 'Poppins',
    fontSize: 7,
  },
  status2: {

    color: '#d4af37',
    fontFamily: 'Poppins',
    fontSize: 12,
  },
  status1: {

    color: '#3e3e3e',
    fontFamily: 'Poppins-Medium',
    fontSize: 9
  },
  gridTextSmall: {
    color: '#707070',
    fontFamily: 'Poppins-Medium',
    fontSize: 7,
    textAlign: 'center'
  },

  gridTextBig: {
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    textAlign: 'left',
    marginLeft:10
  },

  grid: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    justifyContent: 'space-between',

  },

  gridContent1: {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'rgba(0, 0, 0, 0.23)',
    shadowOpacity: 1,
    shadowRadius: 4,
    height: 78,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    elevation: 5,
    paddingTop: 15,
    paddingLeft: 30,
    paddingRight: 30
    //marginRight:8
  },
  gridContent2: {
    //width: 120,
    height: 78,
    shadowOpacity: 1,
    shadowColor: 'rgba(0, 0, 0, 0.23)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    elevation: 5,
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,alignItems:'center'
    //marginRight:8
  },

  addFunds2: {

    width: 120,
    height: 24,

     shadowOffset: { width: 6, height: 0 },
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowRadius: 19,
    borderRadius: 25,
    backgroundColor: '#fb0201',
    elevation: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },

  addFundsBtn: {
    fontFamily: 'Poppins-Medium',
    //textAlign: 'center',
    color: '#ffffff',
    //marginTop: 75,
    marginLeft: 8,
    fontSize: 9,

  },
  headerBgCaptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },
  headerBgCaption: {
    justifyContent: 'center',
    alignItems: 'center',
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

  headerArrow: {
    flex: 1,

  },

  headerTitle: {
    flex: 2,
    marginLeft: 35,
    //alignItems: 'center',
    justifyContent: 'center',

  },
  gauge: {
    position: 'absolute',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
  },
  gauge: {
    position: 'absolute',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
  },
  gauge: {
    position: 'absolute',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
  },
  gauge: {
    position: 'absolute',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
  },
});
