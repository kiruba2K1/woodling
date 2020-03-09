import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LoaderImg from 'react-native-image-progress';
import Video from 'react-native-video';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProgressBar from 'react-native-progress/CircleSnail';
import {
  Avatar,
  Portal,
  Dialog,
  Button,
  Paragraph,
  Menu,
} from 'react-native-paper';
import {withNavigation} from 'react-navigation';
import axios from 'axios';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import ActivityPointer from './ActivityPointer';
import crown from '../images/crown.png';
import location from '../images/location.png';
import scriptImg from '../images/script-img.png';
import DefaultAvatar from '../images/ic_account_circle_24px.jpg';
import {connect} from 'react-redux';
import {imageurl, apiurl} from '../constants/config.js';
import DefaultShow from '../images/show_illustration.png';
import DefaultConcert from '../images/concert_illustration.png';
import DefaultDrama from '../images/drama_illustration.png';
import DefaultParty from '../images/party_illustration.png';
import LikeComponentReplaced from './LikeComponentReplaced.js';
import {clearGeneralSearch} from '../redux/actions/generalSearch';
import {clearPosts} from '../redux/actions/searchForPosts';
import {clearSearchedProducts} from '../redux/actions/searchForProducts';
import {clearSearchedEvents} from '../redux/actions/searchForEvents';
import TextView from './TextView';

const Customon = createIconSetFromFontello(fontelloConfig);
const numeral = require('numeral');
const moment = require('moment');

class CompleteStreamComponent extends Component {
  state = {
    likecount: 0,
    deleteDialog: false,
    visible: false,
  };
  componentDidMount() {
    const {type, item} = this.props;
    this.setState({likecount: item.likes});
    if (type === 'casting_call') {
      console.warn(item);
    }
  }
  getLikes = e => {
    this.setState({likecount: e});
  };

  deletePost = async () => {
    const {
      item,
      refreshFeed,
      user_id,
      clearGeneralSearch,
      navposition,
    } = this.props;
    const {post_id} = item;
    const data = {user_id, id: post_id};
    await axios
      .post(`${apiurl}delete-post.php`, data)
      .then(res => {
        if (navposition === 'SearchFilterScreen') {
          clearGeneralSearch();
        }
        if (navposition === 'SearchForPosts') {
          clearPosts();
        }
        if (navposition === 'SearchForProducts') {
          clearSearchedProducts();
        }
        if (navposition === 'SearchForEvents') {
          clearSearchedEvents();
        }
        // this.setState({ deleteDialog: false })
        // console.warn(res.data)
      })
      .catch(res => console.warn('unable to post'));
    setTimeout(() => {
      refreshFeed();
    }, 2000);
    // console.warn(item)
  };

  handleRouting = () => {
    const {navigation, item, type, casting_call_id} = this.props;
    if (
      type === 'photo' ||
      type === 'video' ||
      type === 'script' ||
      type === 'event'
    ) {
      navigation.navigate('PostDetails', {
        type,
        postid: item.post_id,
        profile_thumb: item.profile_thumb,
      });
    }
    if (type === 'product') {
      navigation.push('ProductDetails', {
        productid: item.product_id,
        postid: item.post_id,
      });
    }
    if (type === 'casting_call') {
      navigation.navigate('CastingCallDetail', {
        casting_call_id: casting_call_id ? casting_call_id : item.post_id,
      });
    }
  };
  render() {
    const {
      type,
      item,
      user_id,
      producttype,
      productprice,
      productname,
      productcategory,
      productcurrency,
      productpurpose,
    } = this.props;
    const {likecount, deleteDialog, visible} = this.state;
    const ppurpose = productpurpose ? productpurpose : item.product_purpose;
    return (
      <View style={styles.root}>
        <Portal>
          <Dialog
            visible={deleteDialog}
            onDismiss={() => this.setState({deleteDialog: false})}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Are you sure you want to delete?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                mode="text"
                color="#000"
                onPress={() => this.setState({deleteDialog: false})}>
                NO
              </Button>
              <Button mode="text" color="#000" onPress={this.deletePost}>
                YES
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        {type === 'photo' && (
          <TouchableOpacity activeOpacity={0.8} onPress={this.handleRouting}>
            <View style={styles.photoContainer}>
              <View style={{height: 56, flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 2,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image
                      source={
                        item.profile_thumb === ''
                          ? DefaultAvatar
                          : {uri: `${imageurl}/${item.profile_thumb}`}
                      }
                      size={50}
                    />
                    <Text style={styles.topUsername}>@{item.username}</Text>
                  </TouchableOpacity>
                  <Image source={crown} />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Customon name="image" color="#d1d1d1" />
                </View>
                <View
                  style={{
                    flex: 2,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <View style={{paddingRight: 20, alignItems: 'flex-end'}}>
                    <Menu
                      visible={this.state.visible}
                      onDismiss={() => this.setState({visible: false})}
                      anchor={
                        <TouchableOpacity
                          onPress={() => this.setState({visible: true})}>
                          <Customon
                            name="options-icon-h"
                            size={5}
                            color="#d1d1d1"
                          />
                        </TouchableOpacity>
                      }>
                      {user_id === item.post_user_id ? (
                        <View>
                          <Menu.Item
                            onPress={() =>
                              this.deletePost(user_id, item.post_user_id)
                            }
                            title="Delete"
                          />
                        </View>
                      ) : (
                        <View>
                          <Menu.Item onPress={() => {}} title="Report" />
                          <Menu.Item onPress={() => {}} title="Mute" />
                          <Menu.Item onPress={() => {}} title="Unfollow" />
                          <Menu.Item onPress={() => {}} title="Share" />
                        </View>
                      )}
                    </Menu>
                    <Text style={styles.topUsername}>
                      {moment(
                        parseInt(`${item.date_created}`) * 1000,
                      ).fromNow()}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{height: 267, alignItems: 'center'}}>
                <LoaderImg
                  style={{
                    height: 267,
                    width: '95%',
                    borderRadius: 20,
                    overflow: 'hidden',
                  }}
                  source={{
                    uri: `${imageurl}/${item.path}`,
                  }}
                  indicator={ProgressBar}
                  indicatorProps={{color: '#fb0201'}}
                  progressiveRenderingEnabled
                />
              </View>
              <View
                style={{minHeight: 40, maxheight: 135, paddingHorizontal: 20}}>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#000',
                      fontSize: 9,
                      fontWeight: '600',
                      fontFamily: 'poppins',
                    }}>
                    {item.caption}
                  </Text>
                </View>
                <View style={{flex: 2, flexDirection: 'row'}}>
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row', paddingBottom: 10}}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={likecount} />
                        <LikeComponentReplaced
                          post_id={item.post_id}
                          likecount={likecount}
                          defaultLikes={this.getLikes}
                          like_status={item.like_status}
                        />
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={item.comments} />
                        <Customon
                          name="comment-icon"
                          size={17}
                          color="#6565a0"
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      padding: 5,
                      alignItems: 'center',
                    }}>
                    <Image source={location} />
                    <Text style={[styles.topUsername, {color: 'black'}]}>
                      &nbsp;{item.city !== null && item.city},{' '}
                      {item.country !== null && item.country}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      paddingBottom: 10,
                    }}>
                    {/* <TouchableOpacity style={styles.insightButton}>
                      <Text style={styles.insightsText}>
                        View Insights&nbsp;
                      </Text>
                      <Customon name="arrow-right" color="#fff" />
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {type === 'text' && (
          <TouchableOpacity activeOpacity={0.8} onPress={this.handleRouting}>
            <View style={styles.textContainer}>
              <View style={{height: 61, flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 2,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image
                      source={require('../images/ic_account_circle_24px.jpg')}
                      size={50}
                    />
                    <Text style={styles.topUsername}>@{item.username}</Text>
                  </TouchableOpacity>
                  <Image source={crown} />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/* <Customon name="image" color="#d1d1d1" /> */}
                </View>
                <View
                  style={{
                    flex: 2,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <View style={{paddingRight: 20, alignItems: 'flex-end'}}>
                    <Menu
                      visible={this.state.visible}
                      onDismiss={() => this.setState({visible: false})}
                      anchor={
                        <TouchableOpacity
                          onPress={() => this.setState({visible: true})}>
                          <Customon
                            name="options-icon-h"
                            size={5}
                            color="#d1d1d1"
                          />
                        </TouchableOpacity>
                      }>
                      {user_id === item.post_user_id ? (
                        <View>
                          <Menu.Item
                            onPress={() =>
                              this.deletePost(user_id, item.post_user_id)
                            }
                            title="Delete"
                          />
                        </View>
                      ) : (
                        <View>
                          <Menu.Item onPress={() => {}} title="Report" />
                          <Menu.Item onPress={() => {}} title="Mute" />
                          <Menu.Item onPress={() => {}} title="Unfollow" />
                          <Menu.Item onPress={() => {}} title="Share" />
                        </View>
                      )}
                    </Menu>
                    <Text style={styles.topUsername}>
                      {moment(
                        parseInt(`${item.date_created}`) * 1000,
                      ).fromNow()}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{height: 93, padding: 10, justifyContent: 'center'}}>
                <View
                  style={{borderWidth: 1, borderColor: '#dedede', padding: 5}}>
                  <Text style={styles.textStyle} numberOfLines={3}>
                    {item.body}
                  </Text>
                </View>
              </View>
              <View
                style={{minHeight: 70, maxheight: 81, paddingHorizontal: 20}}>
                {/* <View style={{ flex: 1, paddingHorizontal: 5, justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center' }}>
                                        NIMEX 20TH JINX CELEBRATION
                                    </Text>
                                </View> */}
                <View style={{flex: 2, flexDirection: 'row'}}>
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row', paddingBottom: 10}}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={likecount} />
                        <LikeComponentReplaced
                          post_id={item.post_id}
                          likecount={likecount}
                          defaultLikes={this.getLikes}
                          like_status={item.like_status}
                        />
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={item.comments} />
                        <Customon
                          name="comment-icon"
                          size={17}
                          color="#6565a0"
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      padding: 5,
                      alignItems: 'center',
                    }}>
                    <Image source={location} />
                    <Text style={[styles.topUsername, {color: 'black'}]}>
                      &nbsp;{item.city !== null && item.city},{' '}
                      {item.country !== null && item.country}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      paddingBottom: 10,
                    }}>
                    {/* <TouchableOpacity style={styles.insightButton}>
                      <Text style={styles.insightsText}>
                        View Insights&nbsp;
                      </Text>
                      <Customon name="arrow-right" color="#fff" />
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {type === 'video' && (
          <TouchableOpacity activeOpacity={0.8} onPress={this.handleRouting}>
            <View style={styles.videoContainer}>
              <View style={{height: 56, flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 2,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image
                      source={require('../images/ic_account_circle_24px.jpg')}
                      size={50}
                    />
                    <Text style={styles.topUsername}>@{item.username}</Text>
                  </TouchableOpacity>
                  <Image source={crown} />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Customon name="video" color="#d1d1d1" />
                </View>
                <View
                  style={{
                    flex: 2,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <View style={{paddingRight: 20, alignItems: 'flex-end'}}>
                    <Menu
                      visible={this.state.visible}
                      onDismiss={() => this.setState({visible: false})}
                      anchor={
                        <TouchableOpacity
                          onPress={() => this.setState({visible: true})}>
                          <Customon
                            name="options-icon-h"
                            size={5}
                            color="#d1d1d1"
                          />
                        </TouchableOpacity>
                      }>
                      {user_id === item.post_user_id ? (
                        <View>
                          <Menu.Item
                            onPress={() =>
                              this.deletePost(user_id, item.post_user_id)
                            }
                            title="Delete"
                          />
                        </View>
                      ) : (
                        <View>
                          <Menu.Item onPress={() => {}} title="Report" />
                          <Menu.Item onPress={() => {}} title="Mute" />
                          <Menu.Item onPress={() => {}} title="Unfollow" />
                          <Menu.Item onPress={() => {}} title="Share" />
                        </View>
                      )}
                    </Menu>
                    <Text style={styles.topUsername}>
                      {moment(
                        parseInt(`${item.date_created}`) * 1000,
                      ).fromNow()}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{height: 267, alignItems: 'center'}}>
                <Video
                  source={{uri: `${imageurl}/${item.path}`}} // Can be a URL or a local file.
                  ref={ref => {
                    this.player = ref;
                  }}
                  // paused
                  repeat
                  muted
                  style={styles.backgroundVideo}
                />
              </View>
              <View style={{height: 115, paddingHorizontal: 20}}>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 5,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{textAlign: 'center', textTransform: 'uppercase'}}>
                    {item.caption}
                  </Text>
                </View>
                <View style={{flex: 2, flexDirection: 'row'}}>
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row', paddingBottom: 10}}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={likecount} />
                        <LikeComponentReplaced
                          post_id={item.post_id}
                          likecount={likecount}
                          defaultLikes={this.getLikes}
                          like_status={item.like_status}
                        />
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={item.comments} />
                        <Customon
                          name="comment-icon"
                          size={17}
                          color="#6565a0"
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      padding: 5,
                      alignItems: 'center',
                    }}>
                    <Image source={location} />
                    <Text style={[styles.topUsername, {color: 'black'}]}>
                      &nbsp;{item.city !== null && item.city},{' '}
                      {item.country !== null && item.country}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      paddingBottom: 10,
                    }}>
                    {/* <TouchableOpacity style={styles.insightButton}>
                      <Text style={styles.insightsText}>
                        View Insights&nbsp;
                      </Text>
                      <Customon name="arrow-right" color="#fff" />
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {type === 'script' && (
          <TouchableOpacity activeOpacity={0.8} onPress={this.handleRouting}>
            <View style={styles.scriptContainer}>
              <View style={{height: 63, flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 2,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image
                      source={
                        item.profile_thumb === ''
                          ? DefaultAvatar
                          : {uri: `${imageurl}/${item.profile_thumb}`}
                      }
                      size={50}
                    />
                    <Text style={styles.topUsername}>@{item.username}</Text>
                  </TouchableOpacity>
                  <Image source={crown} />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Customon name="quill-solid" color="#d1d1d1" />
                </View>
                <View
                  style={{
                    flex: 2,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <View style={{paddingRight: 20, alignItems: 'flex-end'}}>
                    <Menu
                      visible={this.state.visible}
                      onDismiss={() => this.setState({visible: false})}
                      anchor={
                        <TouchableOpacity
                          onPress={() => this.setState({visible: true})}>
                          <Customon
                            name="options-icon-h"
                            size={5}
                            color="#d1d1d1"
                          />
                        </TouchableOpacity>
                      }>
                      {user_id === item.post_user_id ? (
                        <View>
                          <Menu.Item
                            onPress={() =>
                              this.deletePost(user_id, item.post_user_id)
                            }
                            title="Delete"
                          />
                        </View>
                      ) : (
                        <View>
                          <Menu.Item onPress={() => {}} title="Report" />
                          <Menu.Item onPress={() => {}} title="Mute" />
                          <Menu.Item onPress={() => {}} title="Unfollow" />
                          <Menu.Item onPress={() => {}} title="Share" />
                        </View>
                      )}
                    </Menu>
                    <Text style={styles.topUsername}>
                      {moment(
                        parseInt(`${item.date_created}`) * 1000,
                      ).fromNow()}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{height: 149, flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 2.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image source={scriptImg} style={{width: 135, height: 136}} />
                </View>
                <View
                  style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={styles.scriptContent}>
                    <View
                      style={{
                        height: 57,
                        justifyContent: 'space-evenly',
                        borderBottomWidth: 1,
                        borderBottomColor: '#dedede',
                        padding: 3,
                      }}>
                      <TextView
                        style={styles.scriptTitle}
                        text="Script Title"></TextView>
                      <Text style={styles.scriptText}>{item.caption}</Text>
                    </View>
                    <View
                      style={{
                        height: 67,
                        justifyContent: 'space-evenly',
                        padding: 3,
                      }}>
                      <TextView
                        style={styles.scriptTitle}
                        text="Script Synopsis By"></TextView>
                      <Text style={styles.scriptText}>
                        {item.synopsis_author}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{height: 94, paddingHorizontal: 13}}>
                {/* <View style={{ flex: 1, paddingHorizontal: 5, justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center' }}>
                                        NIMEX 20TH JINX CELEBRATION
                                    </Text>
                                </View> */}
                <View style={{flex: 2, flexDirection: 'row'}}>
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row', paddingBottom: 10}}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={likecount} />
                        <LikeComponentReplaced
                          post_id={item.post_id}
                          likecount={likecount}
                          defaultLikes={this.getLikes}
                          like_status={item.like_status}
                        />
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={item.comments} />
                        <Customon
                          name="comment-icon"
                          size={17}
                          color="#6565a0"
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      padding: 5,
                      alignItems: 'center',
                    }}>
                    <Image source={location} />
                    <Text style={[styles.topUsername, {color: 'black'}]}>
                      &nbsp;Lagos
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      paddingBottom: 10,
                    }}>
                    {/* <TouchableOpacity style={styles.insightButton}>
                      <Text style={styles.insightsText}>
                        View Insights&nbsp;
                      </Text>
                      <Customon name="arrow-right" color="#fff" />
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {type === 'event' && (
          <TouchableOpacity activeOpacity={0.8} onPress={this.handleRouting}>
            <View style={styles.eventContainer}>
              <View style={{height: 62, flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 2,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image
                      source={
                        item.profile_thumb === ''
                          ? DefaultAvatar
                          : {uri: `${imageurl}/${item.profile_thumb}`}
                      }
                      size={50}
                    />
                    <Text style={styles.topUsername}>@{item.username}</Text>
                  </TouchableOpacity>
                  <Image source={crown} />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Customon name="calendar-alt" size={17} color="#d1d1d1" />
                  <TextView
                    style={{
                      textTransform: 'uppercase',
                      color: '#414141',
                      fontFamily: 'poppins-medium',
                      fontSize: 14,
                    }}
                    text="Show"></TextView>
                </View>
                <View
                  style={{
                    flex: 2,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <View style={{paddingRight: 20, alignItems: 'flex-end'}}>
                    <Menu
                      visible={this.state.visible}
                      onDismiss={() => this.setState({visible: false})}
                      anchor={
                        <TouchableOpacity
                          onPress={() => this.setState({visible: true})}>
                          <Customon
                            name="options-icon-h"
                            size={5}
                            color="#d1d1d1"
                          />
                        </TouchableOpacity>
                      }>
                      {user_id === item.post_user_id ? (
                        <View>
                          <Menu.Item
                            onPress={() =>
                              this.deletePost(user_id, item.post_user_id)
                            }
                            title="Delete"
                          />
                        </View>
                      ) : (
                        <View>
                          <Menu.Item onPress={() => {}} title="Report" />
                          <Menu.Item onPress={() => {}} title="Mute" />
                          <Menu.Item onPress={() => {}} title="Unfollow" />
                          <Menu.Item onPress={() => {}} title="Share" />
                        </View>
                      )}
                    </Menu>
                    <Text style={styles.topUsername}>
                      {moment(
                        parseInt(`${item.date_created}`) * 1000,
                      ).fromNow()}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{height: 149, alignItems: 'center'}}>
                {item.path !== '' && (
                  <LoaderImg
                    style={{
                      height: 149,
                      width: '80%',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                    source={{
                      uri: `${imageurl}/${item.path}`,
                    }}
                    indicator={ProgressBar}
                    indicatorProps={{color: '#fb0201'}}
                    progressiveRenderingEnabled
                  />
                )}
                {item.event_type === 'show' && item.path === '' && (
                  <Image
                    source={DefaultShow}
                    style={{
                      height: 149,
                      width: '80%',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  />
                )}
                {item.event_type === 'concert' && item.path === '' && (
                  <Image
                    source={DefaultConcert}
                    style={{
                      height: 149,
                      width: '80%',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  />
                )}
                {item.event_type === 'drama' && item.path === '' && (
                  <Image
                    source={DefaultDrama}
                    style={{
                      height: 149,
                      width: '80%',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  />
                )}
                {item.event_type === 'party' && item.path === '' && (
                  <Image
                    source={DefaultParty}
                    style={{
                      height: 149,
                      width: '80%',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  />
                )}
              </View>
              <View style={{height: 107, paddingHorizontal: 20}}>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 5,
                    justifyContent: 'center',
                  }}>
                  <Text style={{textAlign: 'center'}}>{item.caption}</Text>
                </View>
                <View style={{flex: 2, flexDirection: 'row'}}>
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row', paddingBottom: 10}}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={likecount} />
                        <LikeComponentReplaced
                          post_id={item.post_id}
                          likecount={likecount}
                          defaultLikes={this.getLikes}
                          like_status={item.like_status}
                        />
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ActivityPointer likes={item.comments} />
                        <Customon
                          name="comment-icon"
                          size={17}
                          color="#6565a0"
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      padding: 5,
                      alignItems: 'center',
                    }}>
                    <Image source={location} />
                    <Text style={[styles.topUsername, {color: 'black'}]}>
                      &nbsp;{item.city !== null && item.city},{' '}
                      {item.country !== null && item.country}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      paddingBottom: 10,
                    }}>
                    {/* <TouchableOpacity style={styles.insightButton}>
                      <Text style={styles.insightsText}>
                        View Insights&nbsp;
                      </Text>
                      <Customon name="arrow-right" color="#fff" />
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {type === 'product' && (
          <TouchableOpacity activeOpacity={0.8} onPress={this.handleRouting}>
            <View style={styles.productContainer}>
              <View style={{flex: 1}}>
                <LoaderImg
                  source={{uri: `${imageurl}/${item.path}`}}
                  style={{
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    borderBottomRightRadius: 13,
                    borderTopRightRadius: 13,
                  }}
                />
              </View>
              <View style={{flex: 1.5}}>
                <View
                  style={{
                    height: 118,
                    paddingHorizontal: 10,
                    justifyContent: 'space-evenly',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        height: 26,
                        borderColor: '#fb0201',
                        borderWidth: 1,
                        borderRadius: 5,
                        paddingHorizontal: 5,
                        justifyContent: 'space-evenly',
                      }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: 'Poppins',
                          fontWeight: '500',
                          color: '#fb0201',
                        }}>
                        {ppurpose === 'sell'
                          ? 'For Sale'
                          : productpurpose === 'rent'
                          ? 'For Rent'
                          : 'none'}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      {item.post_user_id === user_id && (
                        <TouchableOpacity
                          onPress={() => this.setState({deleteDialog: true})}>
                          <Customon name="trash-alt" size={20} />
                        </TouchableOpacity>
                      )}
                      <View style={{marginHorizontal: 5}} />
                      <LikeComponentReplaced
                        post_id={item.post_id}
                        likecount={likecount}
                        defaultLikes={this.getLikes}
                        like_status={item.like_status}
                      />
                    </View>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={{fontSize: 'Poppins', fontSize: 17, color: '#000'}}>
                    {productname ? productname : item.product_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#352642',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 17,
                      opacity: 0.6,
                    }}>
                    {producttype ? producttype : item.product_type}
                  </Text>
                  <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                    <FontAwesome5 name="map-marker-alt" color="#fb0201" />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Poppins',
                        color: '#707070',
                      }}>
                      {item.address}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    height: 35,
                    borderTopWidth: 1,
                    borderTopColor: '#dedede',
                    paddingHorizontal: 5,
                  }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      color: '#fb0201',
                      fontSize: 17,
                      fontWeight: '400',
                      opacity: 0.6,
                    }}>
                    {productcurrency ? productcurrency : item.product_currency}{' '}
                    {productprice
                      ? numeral(productprice).format('0, 0')
                      : numeral(item.product_price).format('0, 0')}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {type === 'casting_call' && (
          <TouchableOpacity activeOpacity={0.8} onPress={this.handleRouting}>
            <View style={styles.callContainer}>
              <View style={{height: 32, flexDirection: 'row'}}>
                <View
                  style={{
                    position: 'absolute',
                    height: 30,
                    width: '100%',
                    backgroundColor: '#fb0201',
                  }}
                />
                <View style={{flex: 3}}>
                  <View
                    style={{
                      flex: 1,
                      borderBottomRightRadius: 20,
                      backgroundColor: '#fff',
                      shadowOpacity: 1,
                      elevation: 100,
                      padding: 5,
                    }}>
                    <Text style={styles.callTitle}>{item.title}</Text>
                  </View>
                </View>
                <View style={{flex: 1.2}}>
                  <View
                    style={{
                      height: 30,
                      backgroundColor: '#fb0201',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.roleNumber}>
                      Roles({item.roles_count})
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{height: 127, backgroundColor: '#fff'}}>
                <View
                  style={{
                    height: 90,
                    padding: 5,
                    justifyContent: 'space-evenly',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={styles.callRole}>
                      <TextView
                        style={styles.roleText}
                        text="Digital Imagery Technician"></TextView>
                    </View>
                    <View style={{marginRight: -5}}>
                      {item.created_by === user_id && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#fb0201',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 19,
                            paddingHorizontal: 3,
                            borderTopLeftRadius: 30,
                            borderBottomLeftRadius: 30,
                          }}>
                          <TextView
                            style={{
                              fontSize: 8,
                              fontFamily: 'Poppins',
                              color: '#fff',
                              fontWeight: '500',
                              marginRight: 10,
                            }}
                            text="View Applicants"></TextView>
                          <Customon
                            name="long-arrow-right"
                            size={13}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <View>
                    <Text numberOfLines={3} style={styles.description}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    height: 37,
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderTopColor: '#dedede',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      borderRightWidth: 1,
                      borderColor: '#dedede',
                      justifyContent: 'center',
                      paddingHorizontal: 2,
                    }}>
                    <Text
                      style={{
                        textTransform: 'capitalize',
                        color: '#000',
                        fontSize: 9,
                        fontWeight: '500',
                        fontFamily: 'Poppins',
                      }}>
                      {item.country}, {item.city}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderRightWidth: 1,
                      borderColor: '#dedede',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={styles.roleTypeButton}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'Poppins',
                          fontWeight: '600',
                          fontSize: 8,
                        }}>
                        {item.production_type}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      borderRightWidth: 1,
                      borderColor: '#dedede',
                      justifyContent: 'center',
                      paddingRight: 5,
                      alignItems: 'flex-end',
                    }}>
                    <Text
                      style={{
                        color: '#fb0201',
                        fontSize: 10,
                        fontFamily: 'Poppins',
                        fontWeight: '700',
                      }}>
                      {item.active === '1' ? 'ACTIVE' : 'INACTIVE'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    marginVertical: 5,
  },
  photoContainer: {
    width: '90%',
    // height: 458,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: '#fff',
  },
  topUsername: {
    color: '#bcc5d3',
    fontSize: 10,
    fontFamily: 'poppins',
  },
  videoContainer: {
    width: '90%',
    height: 438,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: '#fff',
  },
  eventContainer: {
    width: '90%',
    height: 318,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: '#fff',
  },
  textContainer: {
    width: '90%',
    height: 235,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: '#fff',
  },
  scriptContainer: {
    width: '90%',
    height: 306,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: '#fff',
  },
  productContainer: {
    width: '90%',
    height: 154,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 13,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: '#fff',
  },
  callContainer: {
    width: '90%',
    alignSelf: 'center',
    height: 159,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    elevation: 10,
    backgroundColor: '#fff',
  },
  insightButton: {
    width: 110,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.18)',
    shadowOffset: {width: 2, height: 0},
    shadowRadius: 7,
    borderRadius: 25,
    backgroundColor: '#fb0201',
  },
  insightsText: {
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontSize: 9,
  },
  eventTitle: {
    color: '#000000',
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  textStyle: {
    color: '#707070',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
  },
  roleNumber: {
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontSize: 9,
    fontWeight: '500',
  },
  callTitle: {
    color: '#000000',
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
    textTransform: 'uppercase',
  },
  callRole: {
    height: 20,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#fb0201',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  roleText: {
    height: 15,
    color: '#fb0201',
    fontFamily: 'Poppins',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 13,
  },
  description: {
    width: 323,
    height: 39,
    color: '#3e3e3e',
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '600',
  },
  roleTypeButton: {
    height: 18,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#fb0201',
  },
  scriptContent: {
    width: '90%',
    height: 125,
    borderColor: '#dedede',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  scriptTitle: {
    color: '#3e3e3e',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
  },
  scriptText: {
    color: '#3e3e3e',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '600',
  },
  backgroundVideo: {
    height: 267,
    width: '90%',
    borderRadius: 20,
    backgroundColor: '#dedede',
    overflow: 'hidden',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps, {
  clearGeneralSearch,
  clearPosts,
  clearSearchedProducts,
  clearSearchedEvents,
})(withNavigation(CompleteStreamComponent));
