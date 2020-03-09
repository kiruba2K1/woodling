import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image as DefaultImg,
  Share,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import Image from 'react-native-image-progress';
import { connect } from 'react-redux';
import ProgressBar from 'react-native-progress/Pie';
import { Avatar, Menu, Divider } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Video from 'react-native-video';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import fontelloConfig from '../config.json';
import Tooltip from './Tooltip';
import { apiurl, imageurl } from '../constants/config';
import LikeComponent from './LikeComponent';
import {
  viewActivityStream,
  clearActivityStream,
} from '../redux/actions/viewActivityStream';
import Toast from 'react-native-root-toast';

import Icon2 from 'react-native-vector-icons/FontAwesome5';
import TextView from './TextView';

const Customon = createIconSetFromFontello(fontelloConfig);
const numeral = require('numeral');
const moment = require('moment');

const { width, height } = Dimensions.get('window');
class ActivityStream extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      like: false,
      visible: false,
      likeValue: 0,
    };
    this.getData = this.getData.bind(this);
    this.selectPost = this.selectPost.bind(this);
    this.unfollowUser = this.unfollowUser.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    return -1;
    this.onDelete = this.onDelete.bind(this);
  }

  async deleteProduct() {
    const { productid } = this.props;
    await axios.get(`${apiurl}delete-product.php?id=${productid}`).then(res => {
      // console.warn(res.data);
      this.props.Refresh();
    });
  }

  onDelete(user_id, id) {
    const page = 1;
    const data = { user_id, page };
    axios
      .get(`${apiurl}delete-post.php?user_id=${user_id}&id=${id}`)
      .then(reins => {
        // console.log(reins.data);
        this.props.Refresh();
        //  this.props.navigation.navigate('ActivityStream')
      });
  }

  // componentDidUpdate() {
  //   const { Item, activeItem, type } = this.props;
  //   if (Item === activeItem && type === 'video') {
  //     VideoPlayer.resume(true);
  //   } else if (Item !== activeItem && type === 'video') {
  //     VideoPlayer.pause(true);
  //   }
  // }

  likePost() {
    this.setState({ like: 'like' });
  }

  getData(val) {
    this.setState({ likeValue: val });
  }

  unfollowUser(e) {
    const { user_id, Item } = this.props;
    console.warn(Item);
    axios
      .post(
        `${apiurl}unfollow-user.php?user_id=${Item.post_user_id}&follower_id=${user_id}`,
      )
      .then(res => {
        if (res.data.status === 'success') {
          this.props.Refresh();
        }
      })
      .catch(res => console.log(res.data));
  }

  selectPost(e) {
    const { type, postid, productid, profile_thumb, navigation } = this.props;
    if (
      type === 'photo' ||
      type === 'video' ||
      type === 'event' ||
      type === 'script'
    ) {
      this.props.navigation.navigate('PostDetails', {
        type,
        postid,
        profile_thumb,
      });
    }
    if (type === 'product') {
      // console.warn(this.props.Item);
      navigation.push('ProductDetails', {
        productid,
        postid,
      });
    }
  }

  block = () => {
    console.warn(this.props.user_id, this.props.theirid);
    axios
      .get(
        `${apiurl}block-user?user_id=${
        this.props.user_id
        }&blocked_id=${parseInt(this.props.theirid)}`,
      )
      .then(res => {
        console.warn(res.data);
        if (res.data.status == 'success') {
          this.props.Refresh();
          Toast.show('User Blocked', {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
        } else
          Toast.show(res.data.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
      })
      .catch(res =>
        Toast.show('Unable to block user', {
          //"Error occured please try again"
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        }),
      );
  };

  share(Item) {
    Share.share({
      message: 'Install this app now',
      url: '',
      title: 'Woodlig',
    });
    console.log('Item list : ', Item);
    console.log('Promotion to share : ', Item);
    const { user_id } = this.props;

    if (
      Item.post_promotion_id != undefined &&
      Item.post_promotion_id != null &&
      Item.post_promotion_id != ''
    ) {
      axios
        .get(
          `${apiurl}increase-share-count.php?user_id=${user_id}&promotions_id=${Item.post_promotion_id}`,
        )
        .then(reins => {
          console.log(reins.data);
        });
    }
  }
  block = () => {
    Axios.get(
      `${apiurl}block-user.php?user_id=${this.props.user_id}&blocked_id=${this.props.theirid}`,
    )
      .then(res => {
        if (res.data.status == true) {
          this.props.Refresh();
          Toast.show('User Blocked', {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
        } else
          Toast.show(res.data.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
      })
      .catch(res =>
        Toast.show(res.message, {
          //"Error occured please try again"
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        }),
      );
  };

  getView(insights, Item, user_id, theirid, datecreated, onSelect) {
    if (insights != true) {
      if (Item.promotion_status == null) {
        if (user_id != theirid) {
          return (
            <Text style={{ fontSize: 10 }}>
              {moment(parseInt(`${datecreated}`) * 1000).fromNow()}
            </Text>
          );
        } else {
          return (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ChooseAudience', {
                  user_id: this.props.user_id,
                  theirid: this.props.theirid,
                  postid: this.props.postid,
                })
              }>
              <View style={styles.addFunds}>
                <Icon2 name="chart-line" color="#ffff" size={9} />
                <TextView style={styles.addFundsBtn} text="Promote"></TextView>
              </View>
            </TouchableOpacity>
          );
        }
      } else {
        if (user_id == theirid) {
          return (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('PromotionsInsights', {
                  user_id: this.props.user_id,
                  theirid: this.props.theirid,
                  postid: this.props.postid,
                  promotion_id: Item.post_promotion_id,
                  post_data: Item,
                })
              }>
              <View style={styles.addFunds}>
                <Icon2 name="chart-line" color="#ffff" size={9} />
                <TextView style={styles.addFundsBtn} text="Insights"></TextView>
              </View>
            </TouchableOpacity>
          );
        } else {
          return (
            <View>
              <View style={styles.addFundsTest}>
                <Icon2 name="chart-line" color="#ffff" size={9} />
                <TextView
                  style={[styles.addFundsBtn, { color: 'red' }]}
                  text="Promoted"></TextView>
              </View>
            </View>
          );
        }
      }
    } else {
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('PromotionsInsights', {
              user_id: this.props.user_id,
              theirid: this.props.theirid,
              postid: this.props.postid,
              promotion_id: Item.id,
              post_data: Item,
              onSelect: onSelect,
            })
          }>
          <View style={styles.addFunds}>
            <Icon2 name="chart-line" color="#ffff" size={9} />
            <TextView style={styles.addFundsBtn} text="Insight"></TextView>
          </View>
        </TouchableOpacity>
      );
    }
  }

  //   insights != true ? (
  //   <TouchableOpacity onPress={()=>  this.props.navigation.navigate('ChooseAudience', {
  //     user_id: this.props.user_id,
  //     theirid: this.props.theirid,
  //     postid: this.props.postid
  //   })}>
  //   <View style={styles.addFunds}>
  //     <Icon2 name="chart-line" color="#ffff" size={9} />
  //     <Text style={styles.addFundsBtn}>Promotions</Text>
  //   </View>
  // </TouchableOpacity>
  // ) : (
  //   <TouchableOpacity onPress={()=>  this.props.navigation.navigate('PromotionsInsights', {
  //     user_id: this.props.user_id,
  //     theirid: this.props.theirid,
  //     postid: this.props.postid,
  //     promotion_id: Item.id,
  //   })}>
  //   <View style={styles.addFunds}>
  //     <Icon2 name="chart-line" color="#ffff" size={9} />
  //     <Text style={styles.addFundsBtn}>Insight</Text>
  //   </View>
  // </TouchableOpacity>
  // )
  //   return <View><Text>Test</Text></View>
  // }

  render() {
    const {
      user_id,
      theirid,
      postid,
      type,
      path,
      caption,
      event_type,
      username,
      likes,
      comments,
      profile_thumb,
      likestatus,
      productpurpose,
      productname,
      productprice,
      productcurrency,
      producttype,
      productid,
      datecreated,
      formatted_address,
      Item,
      trending,
      insights,
      promotion_id,
      onSelect,
    } = this.props;
    const { like, likeValue } = this.state;
    const paddingAdjust =
      type === 'text' ||
      type === 'video' ||
      type === 'image' ||
      type === 'event' ||
      type === 'script';
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={this.selectPost}>
        {/* everything about product starts and ends at the top */}
        {type === 'product' ? (
          <View
            style={{
              marginTop: 10,
              elevation: 4,
              borderRadius: 20,
              height: 150,
              alignSelf: 'center',
              width: '90%',
              backgroundColor: '#ffffff',
              flexDirection: 'row',
            }}>
            <View style={{ flex: 2 }}>
              <DefaultImg
                resizeMode="cover"
                style={{ height: 150, borderRadius: 20, width: '100%' }}
                source={{ uri: `${imageurl}/${path}` }}
              />
            </View>
            <View style={{ flex: 3 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginHorizontal: 13,
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'red',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fb0201',
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {productpurpose === 'sell'
                      ? 'For Sale'
                      : productpurpose === 'rent'
                        ? 'For Rent'
                        : 'none'}
                  </Text>
                </View>
                <LikeComponent
                  likeType="post"
                  sendData={this.getData}
                  post_id={postid}
                  likes={likes}
                  like_status={likestatus}
                />
              </View>
              <View style={{ flex: 3 }}>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 20,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#707070ff',
                        fontFamily: 'Poppins-Medium',
                      }}
                      numberOfLines={2}>
                      {productname}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#000',
                        fontFamily: 'Poppins-Medium',
                        textTransform: 'capitalize',
                      }}
                      numberOfLines={2}>
                      {producttype}
                    </Text>
                  </View>
                  {parseInt(this.props.user_id) ===
                    parseInt(Item.post_user_id) && (
                      <TouchableOpacity onPress={this.deleteProduct}>
                        <FontAwesome5 name="trash" size={20} />
                      </TouchableOpacity>
                    )}
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    paddingRight: 10,
                    paddingLeft: 20,
                  }}>
                  <FontAwesome5
                    name="map-marker-alt"
                    style={{ marginRight: 5 }}
                    color="red"
                    size={15}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#707070',
                      fontFamily: 'Poppins-Medium',
                    }}
                    numberOfLines={1}>
                    {this.props.address}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  borderTopWidth: 1,
                  borderColor: '#dedede',
                  paddingRight: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    fontSize: 14,
                    color: '#fb0201',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {productcurrency}
                  {numeral(productprice).format('0, 0')}
                </Text>
              </View>
            </View>
          </View>
        ) : (
            <View>
              <View
                style={{
                  marginTop: 10,
                  // height: 'auto',
                  paddingBottom: 10,
                  paddingTop: paddingAdjust ? 10 : 0,
                  backgroundColor: '#ffffff',
                  marginHorizontal: 10,
                  width: trending === 'trending' ? 350 : '95%',
                  alignSelf: 'center',
                  borderRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 4,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      this.props.navigation.navigate('ProfileScreen', {
                        user_id: this.props.user_id,
                        theirid: this.props.theirid,
                      })
                    }
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Avatar.Image
                      style={{ marginRight: 8 }}
                      size={30}
                      source={
                        profile_thumb === ''
                          ? require('../images/Avatar_invisible_circle_1.png')
                          : { uri: `${imageurl}/${profile_thumb}` }
                      }
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#bcc5d3',
                      }}>{`@${username}`}</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',

                      // justifyContent: 'space-evenly'
                    }}>
                    {type === 'event' && (
                      <Customon
                        name="calendar-alt"
                        color="#d1d1d1"
                        size={16}
                        style={{ paddingTop: 15 }}
                      />
                    )}
                    {/* {type === 'product' && <Customon name="shopping-cart" color="#d1d1d1" size={20} />} */}
                    {type === 'photo' && (
                      <Customon
                        name="image"
                        color="#d1d1d1"
                        size={16}
                        style={{ paddingTop: 15 }}
                      />
                    )}
                    {type === 'video' && (
                      <Customon name="video" color="#d1d1d1" size={16} />
                    )}
                    {type === 'script' && (
                      <Customon name="quill-solid" color="#d1d1d1" size={16} />
                    )}
                    <Text>{type === 'event' && event_type}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    <Menu
                      visible={this.state.visible}
                      onDismiss={() => this.setState({ visible: false })}
                      anchor={
                        <TouchableOpacity
                          onPress={() => this.setState({ visible: true })}>
                          <FontAwesome5 name="ellipsis-h" size={17} />
                        </TouchableOpacity>
                      }>
                      {user_id === theirid ? (
                        <View>
                          <Menu.Item
                            onPress={() => this.onDelete(user_id, postid)}
                            title="Delete"
                          />
                          {/* // <Menu.Item onPress={() => {}} title="Edit" />
                        // <Menu.Item onPress={() => {}} title="Archive" />
                        // <Menu.Item onPress={() => {}} title="Promote" /> */}
                        </View>
                      ) : (
                          <View>
                            <Menu.Item
                              onPress={() => {
                                // console.warn(this.props.Item);
                                this.props.navigation.navigate('ReportPost', {
                                  post_id: this.props.Item.post_id,
                                });
                              }}
                              title="Report"
                            />
                            {/*<Menu.Item onPress={() => {}} title="Mute" />*/}
                            <Menu.Item
                              onPress={this.unfollowUser}
                              title="Unfollow"
                            />
                            <Menu.Item
                              onPress={() => this.share(Item)}
                              title="Share"
                            />
                            <Menu.Item onPress={this.block} title="Block" />
                          </View>
                        )}
                    </Menu>
                  </View>
                </View>
                {type === 'video' && (
                  <VideoPlayer
                    pauseOnPress
                    video={{ uri: `${imageurl}/${path}` }}
                  />
                )}
                {type === 'text' && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      width: '90%',
                      borderWidth: 0.5,
                      borderColor: '#dedede',
                      paddingVertical: 5,
                      paddingHorizontal: 5,
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Poppins-Medium',
                        color: '#707070',
                      }}>
                      {this.props.text.length >= 200
                        ? `${this.props.text.substr(0, 80)}...`
                        : this.props.text}
                    </Text>
                  </View>
                )}
                {type === 'script' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginHorizontal: 15,
                    }}>
                    <DefaultImg
                      source={require('../images/script-img.png')}
                      style={{ width: 135, height: 136 }}
                    />
                    <View
                      style={{
                        width: 189,
                        height: 113,
                        borderColor: '#dedede',
                        borderWidth: 1,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          borderBottomWidth: 0.5,
                          borderBottomColor: '#dedede',
                          paddingHorizontal: 10,
                        }}>
                        <TextView
                          style={{
                            color: '#3e3e3e',
                            fontSize: 12,
                            fontWeight: '400',
                          }}
                          text="Script Title"></TextView>
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '600',
                            color: '#3e3e3e',
                          }}>
                          {this.props.caption}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          borderTop: 0.5,
                          borderColor: '#dedede',
                          paddingHorizontal: 10,
                        }}>
                        <TextView
                          style={{
                            color: '#3e3e3e',
                            fontSize: 12,
                            fontWeight: '400',
                          }}
                          text={`Script Synopsis By: ${Item.synopsis_author}`}></TextView>
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '600',
                            color: '#3e3e3e',
                          }}>
                          {this.props.body}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                {type === 'photo' && (
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      style={{
                        height: 200,
                        width: '90%',
                        borderRadius: 20,
                        overflow: 'hidden',
                      }}
                      source={{
                        uri: `${imageurl}/${path}`,
                      }}
                      indicator={ProgressBar}
                      progressiveRenderingEnabled
                    />
                    <Text style={{ paddingHorizontal: 20 }} numberOfLines={3}>
                      {this.props.caption}
                    </Text>
                  </View>
                )}
                {type === 'event' && (
                  <View style={{ alignItems: 'center' }}>
                    {path !== null && (
                      <Image
                        style={{ height: 200, width: '90%' }}
                        source={{
                          uri: `${imageurl}/${path}`,
                        }}
                        indicator={ProgressBar}
                        progressiveRenderingEnabled
                      />
                    )}
                    {path === null && this.props.event_type === 'show' && (
                      <DefaultImg
                        style={{ height: 200, width: '90%' }}
                        source={require('../images/show_illustration.png')}
                      />
                    )}
                    {path === null && event_type === 'concert' && (
                      <DefaultImg
                        style={{ height: 200, width: '90%' }}
                        resizeMode="contain"
                        source={require('../images/concert_illustration.png')}
                      />
                    )}
                    {path === null && event_type === 'drama' && (
                      <DefaultImg
                        style={{ height: 200, width: '90%' }}
                        resizeMode="contain"
                        source={require('../images/drama_illustration.png')}
                      />
                    )}
                    {path === null && event_type === 'party' && (
                      <DefaultImg
                        style={{ height: 200, width: '90%' }}
                        resizeMode="contain"
                        source={require('../images/party_illustration.png')}
                      />
                    )}
                  </View>
                )}
                {/* {type === 'product' && (
            <View>
              <Image
                style={{ height: 200 }}
                source={{
                  uri: `${imageurl}/${path}`,
                }}
                progressiveRenderingEnabled
              />
            </View>
          )} */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 20 }}>
                    <View style={{ paddingRight: 20, alignItems: 'center' }}>
                      <Tooltip
                        color="#fb0201"
                        likes={numeral(likeValue).format('0 a')}
                      />
                      <LikeComponent
                        likeType="post"
                        sendData={this.getData}
                        post_id={postid}
                        likes={likes}
                        like_status={likestatus}
                      />
                    </View>
                    <View style={{ paddingRight: 20, alignItems: 'center' }}>
                      <Tooltip color="#6565A0" likes={comments} />
                      <FontAwesome5 name="comment" size={20} color="#6565A0" />
                    </View>
                  </View>
                  {this.props.type === 'event' && (
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1}>{this.props.address}</Text>
                      <TextView style={{ fontSize: 20 }} text="See more"></TextView>
                    </View>
                  )}
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      paddingRight: 20,
                    }}>
                    {this.getView(
                      insights,
                      Item,
                      user_id,
                      theirid,
                      datecreated,
                      onSelect,
                    )}

                    {/* <FontAwesome5 name="share-alt" size={20} /> */}
                  </View>
                </View>
              </View>
            </View>
          )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topStar: {
    width: 100,
    height: 55,
    paddingLeft: 8,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: { width: 3, height: 0 },
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  iconStyle: {
    marginVertical: 18,
    zIndex: 100,
  },
  actionbuttonStyles: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 26.33,
    alignSelf: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 9,
  },
  addFundsBtn: {
    fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    color: '#ffffff',
    // marginTop: 75,
    fontSize: 9,
  },

  addFunds: {
    // width: 80,
    padding: 7,
    height: 27,
    shadowColor: '#F00',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 7,
    borderRadius: 25,
    backgroundColor: '#fb0201',
    elevation: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 1,
    marginLeft: 3,
  },
  addFundsTest: {
    // width: 80,
    padding: 7,
    height: 27,
    shadowColor: 'gray',
    borderRadius: 1,
    borderColor: 'red',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    borderRadius: 25,
    backgroundColor: '#FFF',
    elevation: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 1,
    marginLeft: 3,
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
});
export default connect(mapStateToProps)(withNavigation(ActivityStream));
