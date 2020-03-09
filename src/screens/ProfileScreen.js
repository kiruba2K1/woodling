import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Modal,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Avatar, Badge, Button, Dialog, Portal, Menu} from 'react-native-paper';
import axios from 'axios';
import {apiurl, localurl, imageurl} from '../constants/config';
import AboutYourProfile from './AboutYourProfile';
import ProfileActivity from './ProfileActivity';
import ProfileRatingsScreen from './ProfileRatingsScreen';
import ProfilePeople from './ProfilePeople';
import TextView from '../components/TextView';
import Toast from 'react-native-root-toast';
import Axios from 'axios';

HEADER_MAX_HEIGHT = 340;
HEADER_MIN_HEIGHT = 80;
MAX_STAR_RATING_HEIGHT = 100;
MIN_STAR_RATING_HEIGHT = 30;

const {width, height} = Dimensions.get('window');
// const user_id = 5;
// const user_profile_id = 4;

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const userid = navigation.getParam('user_id');
    this.state = {
      scrollY: new Animated.Value(0),
      tab: 'Activity',
      profiledetails: [],
      screenHeight: 0,
      following: false,
      visible: false,
      prePrice: [],
      premium: false,
      loading: true,
      preData: [],
      Mvisible:false
    };
    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this.followUser = this.followUser.bind(this);
    this.unfollowUser = this.unfollowUser.bind(this);
  }

  componentDidMount() {
    this.GetData();
  }

  GetData = () => {
    this.setState({loading: true});
    const {navigation} = this.props;
    const userid = navigation.getParam('user_id');
    const theirid = navigation.getParam('theirid');

    axios
      .get(
        `${apiurl}fetch-user-profile.php?user_id=${userid}&user_profile_id=${theirid}`,
      )
      .then(res => {
        this.setState({profiledetails: res.data});
        console.log('--------- GetData UserProfile : ', res.data);
        axios
          .get(`${apiurl}fetch-premium-user-details.php?user_id=${userid}`)
          .then(res => {
            console.log('--------- GetData', res.data);
            if (res.data.status == 'success') {
              this.setState({
                preData:
                  res.data.premium_details != 'empty'
                    ? res.data.premium_details[0]
                    : res.data.premium_details,
                loading: false,
              });
            }
            // else
            // {
            //   alert(res.data.message)
            // }
          })
          .catch(err => {
            //  alert(err.message)
          });
      })
      .catch(res => {
        this.setState({loading: false});
        console.log(res.data);
      });

    axios
      .get(`${apiurl}fetch-premium-pricing.php`)
      .then(res => {
        if (res.data.status == 'success') {
          this.setState({prePrice: res.data.premium_pricing});
        }
        // else
        // {
        //   alert(res.data.message)
        // }
      })
      .catch(err => {
        //  alert(err.message)
      });
  };

  componentDidUpdate(prevProps, prevState) {
    const {profiledetails} = this.state;
    // console.log(profiledetails);
    if (this.state.profiledetails !== prevState.profiledetails) {
      if (profiledetails.data.following_status === null) {
        this.setState({following: false});
      } else {
        this.setState({following: true});
      }
    }
  }

  onContentSizeChange(contentWidth, contentHeight) {
    // console.log(contentWidth, contentHeight)
    this.setState({screenHeight: contentHeight});
  }

  followUser() {
    const {navigation} = this.props;
    const userid = navigation.getParam('user_id');
    const theirid = navigation.getParam('theirid');
    this.setState({following: true});
    console.log('follow');
    // const reaction = 'follow';
    axios
      .post(`${apiurl}follow-user.php?user_id=${theirid}&follower_id=${userid}`)
      .then(res => console.log(res.data))
      .catch(res => console.log(res.data));
  }

  async unfollowUser() {
    const {navigation} = this.props;
    const userid = navigation.getParam('user_id');
    const theirid = navigation.getParam('theirid');
    this.setState({following: false});
    await axios
      .post(
        `${apiurl}unfollow-user.php?user_id=${theirid}&follower_id=${userid}`,
      )
      .then(res => console.log(res.data))
      .catch(res => console.log(res.data));
    this.setState({visible: false});
  }

  hideDialog() {
    this.setState({visible: false});
  }

  showDialog() {
    this.setState({visible: true});
  }

  _messagePress() {
    const {profiledetails} = this.state;
    const picture =
      profiledetails.data.profile_picture != ''
        ? apiurl + profiledetails.data.profile_picture
        : profiledetails.data.profile_picture;
    const name = profiledetails.data.full_name;
    const user_id = profiledetails.user_profile_id;

    const {navigation} = this.props;
    const userid = navigation.getParam('user_id');
    const theirid = navigation.getParam('theirid');

    const user = {
      picture,
      name,
      user_id,
    };
    console.log('User Send: ', user);
    console.log('theirid: ', theirid);

    this.props.navigation.navigate('MessagingScreen', {
      theirid,
      user,
    });
  }

  block = () => {
    const {navigation} = this.props;
    const userid = navigation.getParam('user_id');
    const theirid = navigation.getParam('theirid');

    Axios.get(
      `${apiurl}block-user.php?user_id=${userid}&blocked_id=${theirid}`,
    )
      .then(res => {
        if (res.data.status == true) {
          this.setState({Mvisible:false})
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


  render() {
    const {tab, profiledetails, screenHeight, following} = this.state;
    console.log('Profile details : ', profiledetails.message_status);
    const {navigation} = this.props;
    const userid = navigation.getParam('user_id');
    const theirid = navigation.getParam('theirid');
    const scrollEnabled = screenHeight > height;
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });
    const starRatingHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [
        (HEADER_MAX_HEIGHT - MAX_STAR_RATING_HEIGHT) / 2,
        (HEADER_MIN_HEIGHT - MIN_STAR_RATING_HEIGHT) / 2,
      ],
      extrapolate: 'clamp',
    });
    const starRatingLength = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [MAX_STAR_RATING_HEIGHT, MIN_STAR_RATING_HEIGHT],
      extrapolate: 'clamp',
    });
    const bigOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const smallOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [0, 0.9],
      extrapolate: 'clamp',
    });
    if (!this.state.loading || profiledetails.data != undefined) {
      return (
        <View style={{flex: 1}}>
          <Portal>
            <Dialog
              visible={this.state.visible}
              onDismiss={this.hideDialog.bind(this)}>
              <Dialog.Title>Unfollow</Dialog.Title>
              <Dialog.Content>
                {/* <Paragraph>This is simple dialog</Paragraph> */}
                <Text style={{fontSize: 20}}>
                  Stop following&nbsp;
                  <Text style={{textTransform: 'capitalize'}}>
                    {profiledetails.data.full_name}
                  </Text>
                  ?
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  style={{}}
                  color="black"
                  onPress={() => this.setState({visible: false})}>
                  NO
                </Button>
                <Button color="black" onPress={this.unfollowUser}>
                  YES
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <StatusBar />
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: 'lightskyblue',
              height: headerHeight,
              // zIndex: headerZindex,
              // elevation: headerZindex,//required for android
              // alignItems: 'center'
            }}>
            <ImageBackground
              source={{
                uri: `${imageurl}/${profiledetails.data.cover_picture}`,
              }}
              style={{flex: 1}}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={{zIndex: 1111111}}
                  onPress={() => this.props.navigation.goBack()}>
                  <Icon
                    name="arrow-left"
                    style={styles.iconStyle}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
                <Animated.View
                  style={[styles.topStar, {opacity: smallOpacity}]}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={parseInt(`${profiledetails.data.rating}`)}
                    starSize={15}
                    fullStarColor="red"
                    starStyle={{width: 18}}
                    containerStyle={{width: 15}}
                  />
                </Animated.View>
                {this.props.user_id === theirid ? (
                  <TouchableOpacity
                    style={{zIndex: 1111111}}
                    onPress={() => this.props.navigation.navigate('Settings')}>
                    <Icon
                      style={styles.iconStyle}
                      name="cog"
                      color="white"
                      size={20}
                    />
                  </TouchableOpacity>
                ) : (
                  <Menu
                    visible={this.state.Mvisible}
                    onDismiss={() => this.setState({Mvisible: false})}
                    anchor={
                      <TouchableOpacity onPress={()=>this.setState({Mvisible:true})} style={{zIndex: 1111111}}>
                    <Icon
                      name="ellipsis-v"
                      style={styles.iconStyle}
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                    }>
                    
                      <View>
                        <Menu.Item onPress={this.block} title="Block" />
                      </View>
                  </Menu>
                )}
              
              </View>
              <Animated.View
                style={{
                  backgroundColor: '#f1f1f1',
                  height: starRatingLength,
                  width: '95%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  alignContent: 'center',
                  borderTopLeftRadius: 25,
                  borderBottomLeftRadius: 25,
                  position: 'absolute',
                  right: 0,
                  top: starRatingHeight,
                  opacity: bigOpacity,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'black',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                  }}>
                  {profiledetails.data.full_name}
                </Text>
                <Text
                  style={{fontSize: 13, color: 'black', textAlign: 'center'}}>
                  @{profiledetails.data.username}
                </Text>
                <View style={{alignSelf: 'center', justifyContent: 'center'}}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={parseInt(`${profiledetails.data.rating}`)}
                    starSize={20}
                    fullStarColor="red"
                    starStyle={{width: 23}}
                  />
                </View>
              </Animated.View>
            </ImageBackground>
          </Animated.View>
          <Animated.View
            style={{
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              backgroundColor: 'red',
              height: 150,
              position: 'relative',
              top: headerHeight,
              zIndex: 9999999,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#f1f1f1',
                zIndex: 10000,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <TouchableOpacity style={{alignSelf: 'center', marginLeft: 20}}>
                <Avatar.Image
                  size={100}
                  source={{
                    uri: `${imageurl}/${profiledetails.data.profile_picture}`,
                  }}
                  style={{
                    borderWidth: 5,
                    borderColor: '#fb0201',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                />
                <Badge
                  size={40}
                  style={{
                    marginTop: -35,
                    padding: 0,
                    backgroundColor: 'transparent',
                    // alignItems: 'center',
                    // justifyContent: 'center'
                  }}>
                  <Image
                    source={require('../images/crown.png')}
                    resizeMode="center"
                    style={{
                      width: 25,
                      height: 25,
                      alignSelf: 'center',
                    }}
                  />
                </Badge>
              </TouchableOpacity>
              {userid === theirid ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        //'PremiumMembership', { data: this.state.profiledetails, prices: this.state.prePrice }
                        if (
                          parseInt(this.state.profiledetails.data.premium) > 0
                        ) {
                          this.setState({premium: true});
                        } else
                          this.props.navigation.navigate({
                            routeName: 'PremiumMembership',
                            key: 'Pre',
                            params: {
                              data: this.state.profiledetails,
                              prices: this.state.prePrice,
                              Refresh: this.GetData,
                            },
                          });
                      }}>
                      <View style={styles.addFunds}>
                        <Image
                          style={{height: 10, width: 13}}
                          source={require('../images/premium-icon-xxxhdpi.png')}
                        />
                        <TextView style={styles.addFundsBtn} text="Account" />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Wallet', {
                          profiledetails: profiledetails.data,
                          userId: userid,
                        })
                      }>
                      <View style={styles.addFunds}>
                        <Icon name="wallet" color="#ffff" size={9} />
                        <TextView style={styles.addFundsBtn} text="Wallet" />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('UserPromotions', {
                          profiledetails: profiledetails.data,
                          userId: userid,
                        })
                      }>
                      <View style={styles.addFunds}>
                        <Icon name="chart-line" color="#ffff" size={9} />
                        <TextView
                          style={styles.addFundsBtn}
                          text="Promotions"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    alignItems: 'center',
                  }}>
                  {/* following and unfollowing change */}
                  {following && (
                    <TouchableOpacity
                      onPress={this.showDialog.bind(this)}
                      style={[styles.actionbuttonStyles, {width: 68.66}]}>
                      <Icon name="check" color="white" size={11} />
                      <TextView
                        style={[styles.actionButtonText, {marginLeft: 5}]}
                        text="Following"
                      />
                    </TouchableOpacity>
                  )}
                  {following === false && (
                    <TouchableOpacity
                      onPress={this.followUser}
                      style={[styles.actionbuttonStyles, {width: 68.66}]}>
                      <Icon name="user-plus" color="white" size={11} />
                      <TextView
                        style={[styles.actionButtonText, {marginLeft: 5}]}
                        text="Follow"
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionbuttonStyles, {width: 86.26}]}
                    onPress={() =>
                      navigation.navigate('RatingsScreen', {
                        recipient_id: theirid,
                        profiledetail: profiledetails.data,
                      })
                    }>
                    <Icon name="star" solid color="white" size={11} />
                    <TextView
                      style={[styles.actionButtonText, {marginLeft: 5}]}
                      text="Rate"
                    />
                  </TouchableOpacity>
                  {profiledetails.message_status == true ? (
                    <TouchableOpacity
                      onPress={() => this._messagePress()}
                      style={[styles.actionbuttonStyles, {width: 62.92}]}>
                      <Icon name="envelope" color="white" size={11} />
                      <TextView
                        style={[styles.actionButtonText, {marginLeft: 5}]}
                        text="Message"
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                flexDirection: 'row',
                paddingLeft: '5%',
                paddingRight: '2%',
              }}>
              <TouchableOpacity
                onPress={() => this.setState({tab: 'About'})}
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  borderBottomWidth: 3,
                  borderBottomColor:
                    this.state.tab === 'About' ? 'red' : 'transparent',
                }}>
                <TextView
                  style={{fontSize: 15, paddingBottom: 10}}
                  text="About"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({tab: 'Activity'})}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderBottomWidth: 3,
                  borderBottomColor:
                    this.state.tab === 'Activity' ? 'red' : 'transparent',
                }}>
                <Text style={{fontSize: 15, textAlign: 'center'}}>
                  {parseInt(profiledetails.data.post_count) +
                    parseInt(profiledetails.data.album_count) +
                    parseInt(profiledetails.data.tag_count)}
                </Text>
                <TextView
                  style={{fontSize: 15, textAlign: 'center'}}
                  text="Activity"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({tab: 'Ratings'})}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderBottomWidth: 3,
                  borderBottomColor:
                    this.state.tab === 'Ratings' ? 'red' : 'transparent',
                }}>
                <Text style={{fontSize: 15, textAlign: 'center'}}>
                  {parseInt(profiledetails.data.rating_count)}
                </Text>
                <TextView
                  style={{fontSize: 15, textAlign: 'center'}}
                  text="Ratings"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({tab: 'People'})}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderBottomWidth: 3,
                  borderBottomColor:
                    this.state.tab === 'People' ? 'red' : 'transparent',
                }}>
                <Text style={{fontSize: 15, textAlign: 'center'}}>
                  {parseInt(profiledetails.data.followers_count) +
                    parseInt(profiledetails.data.following_count)}
                </Text>
                <TextView
                  style={{fontSize: 15, textAlign: 'center'}}
                  text="People"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: '#eeeeee', zIndex: -3}}
            scrollEventThrottle={16}
            nestedScrollEnabled
            onScroll={Animated.event([
              {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
            ])}
            scrollEnabled
            onContentSizeChange={this.onContentSizeChange}>
            <Animated.View
              style={{position: 'relative', top: 360, marginBottom: 420}}>
              {tab === 'About' && (
                <AboutYourProfile theirid={theirid} data={profiledetails} />
              )}
              {tab === 'Activity' && (
                <ProfileActivity
                  theirid={theirid}
                  post_count={profiledetails.data.post_count}
                  tag_count={profiledetails.data.tag_count}
                  album_count={profiledetails.data.album_count}
                />
              )}
              {tab === 'Ratings' && (
                <ProfileRatingsScreen user_id={userid} theirid={theirid} />
              )}
              {tab === 'People' && <ProfilePeople />}
            </Animated.View>
          </ScrollView>
          <Modal transparent visible={this.state.premium} animationType="fade">
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  opacity: 0.5,
                  backgroundColor: '#000',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              <View
                style={{
                  padding: 30,
                  height: '45%',
                  width: '90%',
                  borderBottomLeftRadius: 80,
                  borderTopLeftRadius: 80,
                  borderTopRightRadius: 80,
                  backgroundColor: '#fff',
                }}>
                <View style={{padding: 10}}>
                  <Image
                    style={{width: 60, height: 20, resizeMode: 'contain'}}
                    source={require('../images/woodlig-logo-alt-image.png')}
                  />
                </View>
                {this.state.preData &&
                this.state.preData != 'empty' &&
                this.state.preData.premium_plan != undefined ? (
                  <View style={{padding: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        alignItems: 'center',
                      }}>
                      <TextView
                        style={{marginEnd: 5, fontSize: 16, color: '#000'}}
                        text="Currently on:"
                      />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#000',
                          fontSize: 20,
                        }}>
                        {this.state.preData.premium_plan.toUpperCase()} Plan
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        alignItems: 'center',
                      }}>
                      <TextView
                        style={{marginEnd: 5, fontSize: 13, color: '#000'}}
                        text="Expires at:"
                      />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#000',
                          fontSize: 15,
                        }}>
                        {this.state.preData.expiry_date}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        alignItems: 'center',
                      }}>
                      <TextView
                        style={{marginEnd: 5, fontSize: 13, color: '#000'}}
                        text="Free calls left:"
                      />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#000',
                          fontSize: 15,
                        }}>
                        {this.state.preData.free_casting_calls}
                      </Text>
                    </View>
                  </View>
                ) : null}

                <TouchableOpacity
                  onPress={() => {
                    this.setState({premium: false});
                  }}
                  activeOpacity={0.6}
                  style={{
                    width: 120,
                    height: 45,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#d13108',
                    borderRadius: 50,
                  }}>
                  <TextView style={{color: '#fff', fontSize: 15}} text="Ok" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
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
    shadowOffset: {width: 3, height: 0},
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
    marginLeft: 3,
    fontSize: 9,
  },

  addFunds: {
    // width: 80,
    padding: 10,
    height: 27,
    shadowColor: '#000',
    // shadowOffset: { width: 6, height: 0 },
    shadowRadius: 19,
    borderRadius: 25,
    backgroundColor: '#fb0201',
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
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(ProfileScreen);
