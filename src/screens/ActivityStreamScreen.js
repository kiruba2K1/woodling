import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {Badge} from 'react-native-paper';
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  AsyncStorage,
} from 'react-native';

import {Portal, Modal, Divider, Button} from 'react-native-paper';
import {Header, Avatar} from 'react-native-elements';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {FAB} from 'react-native-paper';
import {navigatePost} from '../redux/actions/navigatePost';
import ActivityStream from '../components/ActivityStream';
import {localurl, apiurl, imageurl} from '../constants/config';
import TextView from '../components/TextView';
import RNRestart from 'react-native-restart';

import firebase from 'react-native-firebase';
import {
  viewActivityStream,
  clearActivityStream,
} from '../redux/actions/viewActivityStream';
import fontelloConfig from '../config.json';
import EmptyActivityStream from './EmptyActivityStream';

const Customon = createIconSetFromFontello(fontelloConfig);
const {width, height} = Dimensions.get('window');

export class ActivityStreamScreen extends Component {
  static navigationOptions = {
    title: 'ActivityStream',
    header: null,
  };

  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      isVisible: false,
      post_type: '',
      data: '',
      count: 1,
      activeItem: {},
      isFetching: false,
      lan: 'en',
      showModal: false,
      notificationCount: 0,
      chatNotificationCount: 0,
    };
    this.onEndReached = this.onEndReached.bind(this);
    this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.notificationSnapShot();
  }

  notificationSnapShot() {
    const {user_id} = this.props;
    this.refStatus = firebase
      .firestore()
      .collection('notifications')
      .doc(user_id);

    this.chatNotification = firebase
      .firestore()
      .collection('users')
      .doc(user_id)
      .collection('unreadMsg');

    this.chatNotification.onSnapshot(querySnapshot => {
      const messages = [];
      var msgCount = 0;
      querySnapshot.forEach(element => {
        console.log('--------- Temp Data', element.data());
        messages.push(element.data());
        msgCount = msgCount + element.data().count;
      });
      this.setState({chatNotificationCount: msgCount});
      console.log('--------- Message count length : ', msgCount);
    });

    this.refStatus.onSnapshot(
      docSnapshot => {
        // console.log('******---- Received notification snapshot All: ', docSnapshot);
        // console.log('******---- Received notification snapshot: ', docSnapshot.data());
        // //var count = JSON.parse(docSnapshot.data());
        // console.log('******---- Received notification snapshot: ', docSnapshot.data().count);
        if (docSnapshot.data() != undefined) {
          this.setState({notificationCount: docSnapshot.data().count});
        }
      },
      err => {
        // console.log("******---- Error inFirestore" , err);
      },
    );
  }

  _retrieveData = async () => {
    // console.log("********* Method called : ")
    try {
      const value = await AsyncStorage.getItem('lan');

      if (value !== null) {
        // We have data!!
        console.log(value);
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
        //alert("Else exicute : " + value);
      }
    } catch (error) {
      // alert("error");
      // console.log("--------- Error",error);
      // Error retrieving data
    }
  };

  componentDidMount() {
    // const user_id = 3;
    const {user_id} = this.props;
    const page = 1;
    const data = {user_id, page};
    this.props.viewActivityStream(data);
  }

  componentDidUpdate() {
    console.log(this.props.activitystreamdata);
  }
  onEndReached() {
    const {count} = this.state;
    const {user_id} = this.props;
    this.setState({count: count + 1});
    const page = count + 1;
    const data = {user_id, page};
    this.props.viewActivityStream(data);
  }

  handlePhoto = () => {
    // this.setState({ post_type: 'photo' });
    this.props.navigation.navigate('NewPostScreen', {
      routeName: 'photo',
    });
    // this.props.navigation.navigate('NewPostScreen', {itemId: this.state.post_type })
  };

  handleVideo() {
    // this.setState({ post_type: 'video' });
    this.props.navigation.navigate('NewPostScreen', {
      routeName: 'video',
    });
  }

  handleEvent() {
    // this.setState({ post_type: 'event' });
    this.props.navigation.navigate('NewPostScreen', {
      routeName: 'event',
    });
  }

  handleSales() {
    // this.setState({ post_type: 'sale' });
    this.props.navigation.navigate('NewPostScreen', {
      routeName: 'sale',
    });
  }

  handleScript() {
    // this.setState({ post_type: 'record' });
    this.props.navigation.navigate('NewPostScreen', {
      routeName: 'script',
    });
  }

  onRefresh = async () => {
    this.setState({isFetching: true});
    const {user_id} = this.props;
    // const user_id = 3;
    const page = 1;
    const data = {user_id, page};
    this.props.viewActivityStream(data);
    this.props.clearActivityStream();
    await this.props.activitystreamdata;
    setTimeout(() => {
      this.setState({isFetching: false});
    }, 1000);
  };

  viewabilityConfig = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 100,
  };

  onViewableItemsChanged(a) {
    if (a.viewableItems[0] !== undefined) {
      // console.log(a.viewableItems[0].item);
      this.setState({activeItem: a.viewableItems[0].item});
    }
  }

  restratAppEn = async () => {
    const {lan} = this.state;
    if (lan != 'en') {
      this.setState({chooseLan: 'en', showModal: true});
    }

    // if(lan != 'en')
    // {
    //   try {
    //     await AsyncStorage.setItem('lan', 'en');
    //     RNRestart.Restart();
    //   } catch (error) {
    //     console.log("----------- Error");
    //     console.error(error);
    //   }
    // }
  };

  restratAppFr = async () => {
    const {lan} = this.state;
    if (lan != 'fr') {
      this.setState({chooseLan: 'fr', showModal: true});
    }
    // if(lan != 'fr')
    // {
    //     try {
    //     await AsyncStorage.setItem('lan', 'fr');
    //     RNRestart.Restart();
    //   } catch (error) {
    //     console.log("----------- Error");
    //     console.error(error);
    //   }
    // }
  };

  async changeLanguage() {
    const {chooseLan} = this.state;
    if (chooseLan == 'fr' || chooseLan == 'en') {
      try {
        await AsyncStorage.setItem('lan', chooseLan);
        RNRestart.Restart();
      } catch (error) {
        console.log('----------- Error');
        console.error(error);
      }
    } else {
      console.log('----------- Else');
    }
  }

  render() {
    const {user_id, profilepicture, activitystreamdata, loading} = this.props;
    const {
      activeItem,
      isFetching,
      lan,
      showModal,
      notificationCount,
      chatNotificationCount,
    } = this.state;
    if (activitystreamdata) {
      return (
        <View style={{flex: 1, backgroundColor: '#ededed', paddingBottom: 40}}>
          <Portal>
            <Modal
              visible={showModal}
              onDismiss={() =>
                this.setState({showModal: false, chooseLan: ''})
              }>
              <View
                style={{
                  width: '75%',
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  padding: 15,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}>
                <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>
                  Change Language
                </Text>
                <Divider style={{marginTop: 10, marginBottom: 10}} />
                <Text
                  style={{
                    color: 'black',
                  }}>{`For changing a language you need to restart the application. \n\nAre you sure do you want to restart and change Language?`}</Text>
                <View
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Button
                    color="red"
                    icon="check"
                    mode="outlined"
                    onPress={() => this.changeLanguage()}>
                    Yes
                  </Button>
                  <Button
                    color="red"
                    icon="cancel"
                    mode="outlined"
                    onPress={() =>
                      this.setState({showModal: false, chooseLan: ''})
                    }
                    style={{marginLeft: 10}}>
                    No
                  </Button>
                </View>
              </View>
            </Modal>
          </Portal>
          <StatusBar
            backgroundColor="transparent"
            translucent
            barStyle="dark-content"
          />
          <Header
            backgroundColor="#ffffff"
            // containerStyle={{ height: 70 }}
            leftComponent={
              <Image
                source={require('../images/woodlig-logo-alt-image.png')}
                resizeMode="stretch"
                style={{width: 46, height: 11}}
              />
            }
            centerComponent={
              !profilepicture ? (
                <Avatar
                  rounded
                  onPress={() =>
                    this.props.navigation.navigate('ProfileScreen', {
                      user_id,
                      theirid: user_id,
                    })
                  }
                  source={require('../images/Avatar_invisible_circle_1.png')}
                />
              ) : (
                <Avatar
                  rounded
                  onPress={() =>
                    this.props.navigation.navigate('ProfileScreen', {
                      user_id,
                      theirid: user_id,
                    })
                  }
                  source={{
                    uri: `${imageurl}/${profilepicture}`,
                  }}
                />
              )
            }
            rightComponent={
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginRight: 5,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Notifications', {
                      userId: user_id,
                    })
                  }>
                  <Customon name="bell" color="black" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginLeft: 5, marginTop: 1}}
                  onPress={() =>
                    this.props.navigation.navigate('Notifications', {
                      userId: user_id,
                    })
                  }>
                  {notificationCount > 0 ? (
                    <Badge
                      style={{
                        marginLeft: 5,
                        marginTop: -3,
                        position: 'absolute',
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: 7,
                      }}
                      size={15}>
                      {notificationCount}
                    </Badge>
                  ) : null}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('MessagingStack')
                  }>
                  <Customon
                    name="comment-dots"
                    color="black"
                    size={20}
                    style={{paddingLeft: 15}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginLeft: 5, marginTop: 1}}
                  onPress={() =>
                    this.props.navigation.navigate('MessagingStack')
                  }>
                  {chatNotificationCount > 0 ? (
                    <Badge
                      style={{
                        marginLeft: 5,
                        marginTop: -3,
                        position: 'absolute',
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: 7,
                      }}
                      size={15}>
                      {chatNotificationCount}
                    </Badge>
                  ) : null}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('SearchScreen')
                  }>
                  <Customon
                    name="search"
                    color="black"
                    size={20}
                    style={{paddingLeft: 15}}
                  />
                </TouchableOpacity>
              </View>
            }
          />
          <FAB
            style={styles.fab}
            small
            icon={() => <Customon name="plus" color="#fb0201" size={22} />}
            onPress={this.handlePhoto}
          />

          {/* <View style={{flexDirection: 'row', padding: 10}}>
            <TouchableOpacity
              onPress={this.restratAppEn}
              style={
                lan != 'fr'
                  ? {
                      padding: 2,
                      borderWidth: 1,
                      borderColor: 'red',
                      backgroundColor: 'white',
                    }
                  : {alignItems: 'center', justifyContent: 'center'}
              }>
              <Image
                style={{height: 20, width: 30}}
                source={require('../images/flag_en.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.restratAppFr}
              style={
                lan == 'fr'
                  ? {
                      padding: 2,
                      marginLeft: 10,
                      borderWidth: 1,
                      borderColor: 'red',
                      backgroundColor: 'white',
                    }
                  : {
                      marginLeft: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
              }>
              <Image
                style={{height: 20, width: 30, padding: 2}}
                source={require('../images/flag_fr.png')}
              />
            </TouchableOpacity>
          </View> */}

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('OnYourMindScreen')}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                backgroundColor: 'transparent',
              }}>
              <View style={styles.searchExtend}>
                {
                  <TextView
                    text="What are you up to ?"
                    style={{
                      textAlign: 'center',
                      color: 'black',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                    }}
                  />
                }
                {}
              </View>
            </View>
          </TouchableOpacity>
          <View style={{backgroundColor: '#eeeeee'}}>
            <FlatList
              data={activitystreamdata}
              ListEmptyComponent={
                this.props.loading == true ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <ActivityIndicator size="large" color="red" />
                  </View>
                ) : this.state.isFetching ==
                  true ? null : activitystreamdata.length > 0 ? null : (
                  <EmptyActivityStream />
                )
              }
              // initialNumToRender={2}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}
              viewabilityConfig={this.viewabilityConfig}
              onViewableItemsChanged={this.onViewableItemsChanged}
              onEndReachedThreshold={1}
              onEndReached={this.onEndReached}
              contentContainerStyle={{paddingBottom: 100}}
              keyExtractor={item => item.post_id}
              renderItem={({item}) => (
                <ActivityStream
                  full_name={item.full_name}
                  username={item.username}
                  text={item.body}
                  type={item.type}
                  address={item.address}
                  path={item.path}
                  event_type={item.event_type}
                  likes={item.likes}
                  like_status={item.like_status}
                  comments={item.comments}
                  profile_thumb={item.profile_thumb}
                  theirid={item.post_user_id}
                  caption={item.caption}
                  postid={item.post_id}
                  datecreated={item.date_created}
                  likestatus={item.like_status}
                  productname={item.product_name}
                  productpurpose={item.product_purpose}
                  productcurrency={item.product_currency}
                  productprice={item.product_price}
                  producttype={item.product_type}
                  productid={item.product_id}
                  activeItem={activeItem}
                  Item={item}
                  Refresh={this.onRefresh}
                />
              )}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  activitystreamdata: state.activitystreamdata.activitystream,
  loading: state.activitystreamdata.loading,
});

export default connect(mapStateToProps, {
  viewActivityStream,
  clearActivityStream,
})(ActivityStreamScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -10,
  },

  searchExtend: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 265,
    height: 33,
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 7,
    borderRadius: 5,
    elevation: 5,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 20,
    backgroundColor: '#fff',
    borderColor: '#fb0201',
    borderWidth: 2,
  },
});
