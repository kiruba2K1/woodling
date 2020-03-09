/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
  Image,
  AsyncStorage
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { Modal, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import axios from 'axios';
import fontelloConfig from '../config.json';
import HeaderComponent from '../components/HeaderComponent';
import WalletPromotion from '../components/WalletPromotion';
import { imageurl, apiurl } from '../constants/config';
import { fetchPostComments, clearPostComments } from '../redux/actions/fetchPostComments';
import TextView from '../components/TextView';
import language from "../constants/language.js"

const Customon = createIconSetFromFontello(fontelloConfig);
export default class PostCommentsReply extends Component {

  constructor(){
    super();
    this._retrieveData();
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

  render() {
    const {lan} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={false} />
        <View style={styles.header}>
          <View style={styles.headerArrow}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Customon style={styles.arrowback} name="long-arrow-left" size={15} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerTitle}>
            <TextView style={styles.title} text='Comments' />
          </View>
          <View style={{ flex: 1 }} />
        </View>

        <ScrollView>
          <View style={styles.content}>

            <View  style={{ flexDirection: 'row', marginBottom: 13 }}>
              <View style={styles.avatarImg}>
                <Image
                  source={require('../images/ic_account_circle_24px.jpg')}
                  style={{ width: 37, height: 37, borderRadius:20}}
                />
              </View>
              <View style={{ flex: 3 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View>
                    <Text style={styles.commentText}>@daniel</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        backgroundColor: '#484d54',
                        opacity: 0.6,
                        borderRadius: 20,
                        marginRight: 5,
                        marginLeft: 3
                      }}
                    />
                    <View>
                      <Text style={styles.duration}>14m ago</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ alignItems: 'center' }}>
                    <TextView styles={styles.trendingText} text='We are changing the world' />
                  </View>
                  <View style={{ alignItems: 'center', marginLeft: 3, justifyContent: 'center' }}>
                    <Image
                      source={require('../images/trendingfire.png')}
                      style={{ width: 14, height: 15 }}
                    />
                  </View>
                </View>
              </View>

              <View
                style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() =>this.props.navigation.navigate('PostCommentsReply')}>
                <TextView style={styles.duration} text='Reply' />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ marginLeft: 10 }}>
                    <FontAwesome5 style={styles.like} name="heart" size={15} color="#fe0000" />
                  </View>
                  <View style={{ marginLeft: 4 }}>
                    <TextView style={styles.duration} text='Likes' />
                  </View>
                </View>
              </View>
            </View>

            <View>
              <View  style={{ flexDirection: 'row', marginBottom: 13 }}>
                <View style={styles.avatarImg}>
                  <Image
                    source={require('../images/ic_account_circle_24px.jpg')}
                    style={{ width: 37, height: 37, borderRadius:20}}
                  />
                </View>
                <View style={{ flex: 3 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Text style={styles.commentText}>@daniel</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
                      <View
                        style={{
                          width: 4,
                          height: 4,
                          backgroundColor: '#484d54',
                          opacity: 0.6,
                          borderRadius: 20,
                          marginRight: 5,
                          marginLeft: 3
                        }}
                      />
                      <View>
                        <Text style={styles.duration}>14m ago</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center' }}>
                      <TextView styles={styles.trendingText} text='We are changing the world' />
                    </View>
                    <View style={{ alignItems: 'center', marginLeft: 3, justifyContent: 'center' }}>
                      <Image
                        source={require('../images/trendingfire.png')}
                        style={{ width: 14, height: 15 }}
                      />
                    </View>
                  </View>
                </View>

                <View stylei need
                  style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <TextView style={styles.duration}
                    onPress={() =>
                      this.props.navigation.navigate('PostCommentsReply')} text='Reply' />
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginLeft: 10 }}>
                      <FontAwesome5 style={styles.like} name="heart" size={15} color="#fe0000" />
                    </View>
                    <View style={{ marginLeft: 4 }}>
                      <TextView style={styles.duration} text='Likes' />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.input}>
         <Image
            source={{
              uri:
                'https://images.askmen.com/1080x540/2016/01/25-021526-facebook_profile_picture_affects_chances_of_getting_hired.jpg'
            }}
            style={styles.img}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: 'Poppins-Medium',
              color: '#959ca7',
              marginLeft: 10
            }}
            placeholder={language.promotions.add_comment(lan)}
          />

          <View style={{ justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={this.addComment}>
              <Image
                source={require('../images/btn_send.png')}
                style={{ width: 102, height: 55 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  like: {
    // backgroundColor: '#fe0000',
  },
  img: {
    width: 37,
    height: 36,
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 6,
    borderRadius: 50,
    elevation: 5
  },
  input: {
    // position: 'absolute',
    // bottom: 0,
    // height: Dimensions.get('window').height - 15,
    //  width: 35,
    height: 55,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 4,
    backgroundColor: '#ffffff',
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10
    // marginBottom: 36
  },
  duration: {
    color: '#787c81',
    fontSize: 10,
    fontFamily: 'Poppins-Medium'
  },
  commentText: {
    color: '#484d54',
    fontFamily: 'Poppins-Medium',
    fontSize: 13
  },

  trendingText: {
    color: '#484d54',
    fontFamily: 'Poppins-Medium',
    fontSize: 9
  },
  avatarImg: {
    flex: 0.8,

  },
  content: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 15,
    marginTop: 15,
    flex: 1,
    // height: 568,

    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { width: -1, height: 0 },
    shadowRadius: 6,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#ffffff',
    elevation: 5,
    padding: 15
  },

  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    //  justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
    padding: 15,

    shadowOffset: { width: 3, height: 0 },
    elevation: 5
  },
  headerTitle: {
    // marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center'
  },

  title: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  },
  name: {
    color: '#1c1c1c',
    fontFamily: 'Poppins-Medium',
    fontSize: 9
  },

  arrowback: {
    color: '#000'
  },

  headerArrow: {
    flex: 1
  }
});
