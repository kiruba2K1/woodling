import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  Platform,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Share,
  AsyncStorage,
} from 'react-native';
import {Header, Avatar, Icon} from 'react-native-elements';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import VideoPlayer from 'react-native-video-player';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {Avatar as PaperAvatar, FAB, Portal, Modal} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import fontelloConfig from '../config.json';
import ViewComments from '../components/ViewComments';
import GalleryPosts from '../components/GalleryPosts';
import LikeComponent from '../components/LikeComponent';
import TextView from '../components/TextView';
import {
  fetchPostComments,
  clearPostComments,
} from '../redux/actions/fetchPostComments';
import {
  viewPostDetails,
  clearPostDetails,
} from '../redux/actions/ViewPostDetails';
import ImageViewer from 'react-native-image-zoom-viewer';
import language from '../constants/language.js';

import {imageurl, apiurl} from '../constants/config';

const moment = require('moment');

const Customon = createIconSetFromFontello(fontelloConfig);
const {width, height} = Dimensions.get('window');

class FinalPostDetails extends Component {
  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      screenHeight: 0,
      type: '',
      like: false,
      comment: '',
      likelist: [],
      loading: false,
      imagePreview: false,
      images: [],
      taggedusers: [],
    };
    this.postComment = this.postComment.bind(this);
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
    const {user_id} = this.props;
    const {navigation} = this.props;
    const posttype = navigation.getParam('type');
    const post_id = navigation.getParam('postid');
    const product_id = navigation.getParam('productid');
    const profile_thumb = navigation.getParam('profile_thumb');
    const data = {user_id, post_id};

    if (
      post_id == undefined ||
      user_id == undefined ||
      post_id == '' ||
      user_id == ''
    ) {
      console.log(
        '----------------',
        'user_id or post_id undefined or null found',
      );
      console.log('user_id', user_id);
      console.log('post_id', post_id);
      this.props.navigation.goBack();
      return;
    }
    this.setState({type: posttype});
    this.props.viewPostDetails(data);
    this.props.fetchPostComments(data);
    // console.log(this.props.postdetail);

    axios
      .get(
        `${apiurl}fetch-post-likes.php?post_id=${post_id}&user_id=${user_id}`,
      )
      .then(res => this.setState({likelist: res.data}))
      .catch(res => console.log(res.data));

    axios
      .get(`${apiurl}fetch-post-tagged-users.php?post_id=${post_id}`)
      .then(res => {
        if (res.data.status === 'success') {
          // console.warn(res.data);
          this.setState({taggedusers: res.data});
        } else {
          this.setState({taggedusers: []});
        }
      })
      .catch(res => console.log(res.data));
  }

  share = () => {
    Share.share({
      message: 'Install this app now',
      url: '',
      title: 'Woodlig',
    });
    console.log('Item list : ', this.props.postdetail);
    console.log('Promotion to share : ', this.props.postdetail.promotion_id);
    const {user_id} = this.props;

    const promotion_id = this.props.postdetail.promotion_id;

    if (
      promotion_id != undefined &&
      promotion_id != null &&
      promotion_id != ''
    ) {
      axios
        .get(
          `${apiurl}increase-share-count.php?user_id=${user_id}&promotions_id=${promotion_id}`,
        )
        .then(reins => {
          console.log(reins.data);
        });
    }
  };

  componentWillUnmount() {
    this.props.clearPostComments();
  }

  componentDidUpdate() {
    // console.log(b.postcomments);
    console.log(this.props.postdetail);
    console.log(this.state.likelist);
  }

  onContentSizeChange = (screenWidth, screenHeight) => {
    // console.log(screenWidth, screenHeight);
    this.setState({screenHeight});
  };

  getData(data) {
    console.log(data);
  }

  async postComment() {
    const {comment, lan} = this.state;
    const {user_id, navigation, postdetail} = this.props;
    const {details} = postdetail;
    const post_id = details.id;
    const data = {post_id, user_id, comment};
    const fetchcomm = {user_id, post_id};
    // console.log(data);
    if (comment.length === 0) {
      return alert('comment cannot be blank');
    }
    this.setState({loading: true});
    await axios
      .post(`${apiurl}add-post-comment.php`, data)
      .then(res => {
        console.log(res.data);
        this.setState({loading: false});
        if (res.data.status === 'success') {
          this.props.fetchPostComments(fetchcomm);
          alert(res.data.message);
          this.textInput.clear();
          Keyboard.dismiss();
        }
      })
      .catch(res => console.log(res.data));
    this.setState({loading: false});
  }

  openImage = image => {
    this.setState({
      images: [
        {
          url: `${imageurl}/${image}`,
          props: {},
        },
      ],
      imagePreview: true,
    });
  };

  render() {
    const {
      like,
      type,
      comment,
      likelist,
      loading,
      taggedusers,
      lan,
    } = this.state;
    const {navigation, postdetail, postcomments, profilepicture} = this.props;
    const profile_thumb = navigation.getParam('profile_thumb');
    const posttype = navigation.getParam('type');
    const {details} = postdetail;

    if (postdetail.length !== 0 && likelist !== []) {
      return (
        <View style={{marginBottom: 110}}>
          <StatusBar transluscent />
          <Portal>
            <Modal visible={loading}>
              <View style={{backgroundColor: '#ffffff'}}>
                <ActivityIndicator />
              </View>
            </Modal>
            <Modal
              onDismiss={() => {
                this.setState({imagePreview: false});
              }}
              dismissable
              contentContainerStyle={{flex: 1}}
              visible={this.state.imagePreview}>
              <View style={{flex: 1, backgroundColor: '#fff'}}>
                <ImageViewer
                  renderHeader={() => (
                    <TouchableOpacity
                      onPress={() => this.setState({imagePreview: false})}
                      style={{
                        top: 20,
                        left: 10,
                        alignSelf: 'flex-start',
                        position: 'absolute',
                        zIndex: 1111111,
                      }}>
                      <Icon size={30} color="#fff" name="close" />
                    </TouchableOpacity>
                  )}
                  imageUrls={this.state.images}
                />
              </View>
            </Modal>
          </Portal>
          {/* <Portal>

            </Portal> */}
          <SafeAreaView>
            <View
              style={{
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
                width: Dimensions.get('window').width,
                backgroundColor: '#ffffff',
              }}>
              <Image
                source={require('../images/woodlig-logo-alt-image.png')}
                resizeMode="stretch"
                style={{width: 46, height: 11}}
              />
            </View>
          </SafeAreaView>

          <View style={styles.miniHeader}>
            <View style={{flex: 1}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Customon name="long-arrow-left" size={15} color="#000000" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 20,
              }}>
              <FontAwesome5
                name="image"
                solid
                color="#000"
                size={18}
                style={{marginHorizontal: 10}}
              />
              <Text style={{fontSize: 12, fontWeight: '700', color: 'black'}}>
                {posttype}
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>
          <ScrollView
            onContentSizeChange={this.onContentSizeChange}
            contentContainerStyle={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity>
                  <PaperAvatar.Image
                    style={{marginRight: 8}}
                    size={47}
                    source={{
                      uri: `${imageurl}/${profile_thumb}`,
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.usernameStyle}>
                  @{postdetail.details.username}
                </Text>
              </View>
              <View>
                {/* <FontAwesome5 name="ellipsis-h" size={20} style={{ alignSelf: 'flex-end' }} /> */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FontAwesome5 name="map-marker-alt" color="red" />

                  <Text style={styles.locationStyle}>
                    &nbsp;{details.city}, {details.country}
                  </Text>
                </View>
              </View>
            </View>
            {type === 'event' && (
              <View style={styles.eventStyle}>
                {postdetail.media.length === 0 ? (
                  <View>
                    {postdetail.details.event_type === 'concert' && (
                      <Image
                        style={{width, height: 191}}
                        source={require('../images/concert_illustration.png')}
                      />
                    )}
                    {postdetail.details.event_type === 'show' && (
                      <Image
                        style={{width, height: 191}}
                        source={require('../images/show_illustration.png')}
                      />
                    )}
                    {postdetail.details.event_type === 'party' && (
                      <Image
                        style={{width, height: 191}}
                        source={require('../images/party_illustration.png')}
                      />
                    )}
                    {postdetail.details.event_type === 'drama' && (
                      <Image
                        style={{width, height: 191}}
                        source={require('../images/drama_illustration.png')}
                      />
                    )}
                  </View>
                ) : (
                  <Image
                    style={{flex: 1}}
                    source={{uri: `${imageurl}/${postdetail.media[0].path}`}}
                  />
                )}
              </View>
            )}
            {type === 'photo' && (
              <Swiper
                paginationStyle={styles.paginationStyle}
                activeDotColor="#fb0201"
                dotColor="#fecbcb"
                dotStyle={{width: 6, height: 6}}
                activeDotStyle={{width: 8, height: 8}}
                showsButtons={false}
                style={{height: 315, marginTop: 10}}>
                {postdetail.media.map((e, index) => (
                  <View style={styles.imageStyle} key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        this.openImage(e.path);
                      }}
                      activeOpacity={0.8}
                      style={styles.imageStyle}>
                      <Image
                        style={styles.imageStyle}
                        source={{uri: `${imageurl}/${e.path}`}}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </Swiper>
            )}

            {type === 'video' && (
              <View style={{height: 315}}>
                <VideoPlayer
                  video={{uri: `${imageurl}/${postdetail.media[0].path}`}}
                  videoWidth={width}
                  videoHeight={315}
                />
              </View>
            )}
            {type === 'script' && (
              <View>
                <View
                  style={{
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#dedede',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TextView style={styles.scriptTitle} text="A SCRIPT TITLE" />
                  <Text style={styles.scriptAuthor}>
                    {' '}
                    BY {postdetail.details.synopsis_author}
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <TextView
                    style={{
                      color: '#000000',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 18,
                      lineHeight: 28,
                      textAlign: 'center',
                    }}
                    text="Synopsis"
                  />
                </View>
                <View style={{paddingHorizontal: 20}}>
                  <Text style={styles.scriptSynopsis}>
                    {postdetail.details.body}
                  </Text>
                </View>
              </View>
            )}
            <View
              style={{
                height: 80,
                borderBottomWidth: 1,
                borderBottomColor: '#dedede',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <View style={styles.shareMenu}>
                <LikeComponent
                  likeType="post"
                  sendData={this.getData}
                  post_id={details.id}
                  likes={details.likes}
                  like_status={details.like_status}
                />
                {/* <Customon name="share" size={20} color="#0ce0b5" /> */}
                {postdetail.details && postdetail.details.privacy === 'public' && (
                  <TouchableOpacity onPress={this.share}>
                    <Customon name="share-alt" size={20} color="#352641" />
                  </TouchableOpacity>
                )}
                {
                  // <Customon name="link" size={20} color="#0052ff" />
                }
              </View>
            </View>
            {taggedusers.status === 'success' && (
              <View
                style={{
                  marginVertical: 20,
                  marginHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View>
                  <FontAwesome5 name="users" />
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {taggedusers.tagged_users.map((e, index) => (
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 10,
                        fontFamily: 'Poppins',
                      }}>
                      @{e.username}
                      {taggedusers.tagged_users.length - 1 !== index && ', '}
                    </Text>
                  ))}
                </View>
              </View>
            )}
            <View style={{marginHorizontal: 20}}>
              {type === 'photo' && (
                <View style={{paddingVertical: 10}}>
                  <Text>{postdetail.details.caption}</Text>
                </View>
              )}
              {type === 'event' && (
                <View>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                        fontSize: 20,
                        textTransform: 'uppercase',
                      }}>
                      {postdetail.details.caption}
                    </Text>
                  </View>
                  <View>
                    <TextView style={styles.smallTitles} text="Description" />
                  </View>
                  <View>
                    <Text>{postdetail.details.body}</Text>
                  </View>
                  <View>
                    <TextView style={styles.smallTitles} text="Venue" />
                  </View>
                  <View>
                    <Text>{details.address}</Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      marginVertical: 10,
                    }}>
                    <Text style={styles.smallTitles}>
                      Date {details.event_date}
                    </Text>
                    <Text style={styles.smallTitles}>
                      Time {details.event_time}
                    </Text>
                  </View>
                </View>
              )}
              {type === 'video' && (
                <View>
                  <View style={{marginVertical: 20}}>
                    <Text
                      style={{
                        textTransform: 'uppercase',
                        color: 'black',
                        fontWeight: '700',
                        fontSize: 18,
                      }}>
                      {details.caption}
                    </Text>
                  </View>
                  <View style={{marginVertical: 20}}>
                    <Text style={{color: 'black'}}>{details.body}</Text>
                  </View>
                </View>
              )}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {likelist.data !== undefined && (
                    <View style={{paddingVertical: 10, flexDirection: 'row'}}>
                      <TextView
                        style={{
                          fontSize: 10,
                          fontFamily: 'Poppins-Medium',
                          color: '#000',
                          lineHeight: 14,
                        }}
                        text="Liked By"
                      />

                      <View>
                        {likelist.data.length === 1 && (
                          <View>
                            {likelist.data[0].profile_thumb === '' ? (
                              <PaperAvatar.Image
                                size={20}
                                source={require('../images/backgroundImage.png')}
                              />
                            ) : (
                              <PaperAvatar.Image
                                size={20}
                                source={{
                                  uri: `${imageurl}/likelist.data[0].profile_thumb`,
                                }}
                              />
                            )}
                          </View>
                        )}

                        {likelist.data.length === 2 && (
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            {likelist.data[0].profile_thumb === '' ? (
                              <PaperAvatar.Image
                                size={20}
                                style={{marginLeft: -10}}
                                source={require('../images/backgroundImage.png')}
                              />
                            ) : (
                              <PaperAvatar.Image
                                size={20}
                                source={{
                                  uri: `${imageurl}/${likelist.data[0].profile_thumb}`,
                                }}
                              />
                            )}
                            {likelist.data[1].profile_thumb ? (
                              <PaperAvatar.Image
                                size={20}
                                style={{marginLeft: -10}}
                                source={require('../images/backgroundImage.png')}
                              />
                            ) : (
                              <PaperAvatar.Image
                                size={20}
                                source={{
                                  uri: `${imageurl}/${likelist.data[1].profile_thumb}`,
                                }}
                              />
                            )}
                          </View>
                        )}
                        {likelist.data.length >= 3 && (
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <View>
                              {likelist.data[0].profile_thumb === '' ? (
                                <PaperAvatar.Image
                                  size={20}
                                  source={require('../images/backgroundImage.png')}
                                />
                              ) : (
                                <PaperAvatar.Image
                                  size={20}
                                  source={{
                                    uri: `${imageurl}/${likelist.data[0].profile_thumb}`,
                                  }}
                                />
                              )}
                            </View>
                            <View>
                              {likelist.data[1].profile_thumb === '' ? (
                                <PaperAvatar.Image
                                  style={{marginLeft: -10}}
                                  size={20}
                                  source={require('../images/backgroundImage.png')}
                                />
                              ) : (
                                <PaperAvatar.Image
                                  size={20}
                                  source={{
                                    uri: `${imageurl}/${likelist.data[1].profile_thumb}`,
                                  }}
                                />
                              )}
                            </View>
                            <PaperAvatar.Text
                              style={{marginLeft: -10}}
                              size={20}
                              label={parseInt(likelist.total_count) - 2}
                              source={require('../images/backgroundImage.png')}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  <View>
                    <Text
                      style={{
                        color: '#808080',
                        fontSize: 10,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Posted&nbsp;
                      {moment(
                        parseInt(`${postdetail.details.date_created}`) * 1000,
                      ).fromNow()}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#dedede',
                    height: 1,
                    width: 200,
                    alignSelf: 'center',
                    marginBottom: 10,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{fontSize: 10, color: '#000', fontWeight: '500'}}>
                      Comments
                      <Text style={{color: 'grey'}}>({details.comments})</Text>
                    </Text>
                  </View>
                  <View>
                    {postcomments.status === 'success' && (
                      <Text
                        style={{fontSize: 10, fontWeight: '400', color: '#000'}}
                        onPress={() =>
                          this.props.navigation.navigate('PostComments', {
                            postdetail,
                          })
                        }>
                        View all comments
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View>{postcomments.length === 0 && <ActivityIndicator />}</View>
              <View>
                {postcomments.length !== 0 && (
                  <View>
                    {postcomments.status === 'empty' && (
                      <Text style={{paddingVertical: 20, paddingLeft: 20}}>
                        {postcomments.message}
                      </Text>
                    )}
                    {postcomments.status === 'success' &&
                      postcomments.comments.map(e => (
                        <ViewComments datum={e} key={e.comment_id} />
                      ))}
                  </View>
                )}
              </View>
            </View>
            <View
              style={{height: 1, width: '100%', backgroundColor: '#dedede'}}
            />
            <View style={{height: 250}}>
              <View style={{marginVertical: 10, marginHorizontal: 20}}>
                <TextView style={styles.postTitleStyle} text="Similar Posts" />
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                {/* <GalleryPosts />
                <GalleryPosts />
                <GalleryPosts /> */}
              </View>
            </View>
          </ScrollView>

          <View style={styles.input}>
            {/*  <Image
              source={{
                uri:
                  'https://images.askmen.com/1080x540/2016/01/25-021526-facebook_profile_picture_affects_chances_of_getting_hired.jpg'
              }}
              style={styles.img}
            /> */}
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                color: '#959ca7',
                marginLeft: 10,
              }}
              ref={input => {
                this.textInput = input;
              }}
              placeholder={language.promotions.add_comment(lan)}
              value={comment}
              onChangeText={comment => this.setState({comment})}
            />

            <View style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity onPress={this.postComment}>
                <Image
                  source={require('../images/btn_send.png')}
                  style={{width: 102, height: 55}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color="black" size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  miniHeader: {
    height: 46,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
    paddingHorizontal: 10,
  },

  input: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 60 : 0,
    // height: Dimensions.get('window').height - 15,
    //  width: 35,
    // flex: 2,
    //  height: 53,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {width: -2, height: 0},
    shadowRadius: 4,
    backgroundColor: '#ffffff',
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    // marginBottom: 36
  },

  img: {
    width: 37,
    height: 36,
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 6,
    borderRadius: 50,
    elevation: 5,
  },

  usernameStyle: {
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight: 14,
  },
  locationStyle: {
    // width: 93,
    // height: 13,
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    flexWrap: 'wrap',
  },
  imageStyle: {
    height: 315,
    width,
  },
  paginationStyle: {
    position: 'absolute',
    top: -350,
  },
  shareMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 50,
    width: 264,
    height: 57,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 3,
  },
  postTitleStyle: {
    width: 68,
    height: 16,
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
  fab: {
    position: 'absolute',
    zIndex: 100,
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  eventStyle: {
    height: 191,
    marginTop: 10,
    borderBottomColor: '#fb0201',
    borderTopColor: '#fb0201',
    borderBottomWidth: 3,
    borderTopWidth: 3,
  },
  smallTitles: {
    height: 16,
    color: '#000000',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    lineHeight: 14,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  scriptSynopsis: {
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  scriptTitle: {
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    textAlign: 'center',
  },
  scriptAuthor: {
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  postdetail: state.viewPostDetail.postdetail,
  postcomments: state.fetchPostComments.postcomments,
});

export default connect(mapStateToProps, {
  viewPostDetails,
  clearPostDetails,
  fetchPostComments,
  clearPostComments,
})(FinalPostDetails);
