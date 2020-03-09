import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import axios from 'axios';
import {connect} from 'react-redux';
import Video from 'react-native-video';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {Avatar, Menu, Divider} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  postValues,
  cleartaggedPeople,
  clearPostLocation,
} from '../redux/actions/handleYourMind';
import {imageurl} from '../constants/config';
import TextView from './TextView';

const {height, width} = Dimensions.get('window');
// eslint-disable-next-line react/prefer-stateless-function
export class VideoPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: [],
      longlat: [],
      title: '',
      description: '',
      privacy: 'public',
      visible: false,
    };
  }

  componentWillUnmount() {
    this.props.cleartaggedPeople();
    this.props.clearPostLocation();
  }

  componentDidUpdate(prevprops) {
    const {location, tag} = this.props;
    const {longlat, video, title, description} = this.state;
    const total = {
      video,
      tag,
      title,
      description,
    };
    this.props.postValues(total);
    console.warn(tag);
  }

  addVideo() {
    ImagePicker.openPicker({
      mediaType: 'video',
      compressImageQuality: 0.6,
    }).then(video => {
      this.setState({video});
    });
  }

  render() {
    const {video, privacy, visible} = this.state;
    const {username, profilepicture, location} = this.props;
    return (
      <ScrollView
        contentContainerStyle={{
          height: height * 1.5,
          paddingTop: 20,
          backgroundColor: '#f1f1f1',
        }}>
        <ScrollView
          style={{width, height: height * 30}}
          contentContainerStyle={{alignItems: 'center'}}>
          <View
            style={{
              height: 'auto',
              width: '95%',
              borderRadius: 20,
              backgroundColor: '#ffffff',
              paddingBottom: 20,
              elavation: 10,
            }}>
            <View
              style={{
                flex: 1.5,
                paddingTop: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Avatar.Image
                  size={50}
                  source={
                    profilepicture === ''
                      ? require('../images/Avatar_invisible_circle_1.png')
                      : {uri: `${imageurl}/${profilepicture}`}
                  }
                />
                <Text
                  style={{
                    color: '#bcc5d3',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 10,
                  }}>
                  @{username}
                </Text>
              </View>
              {/*  <FontAwesome5 name="play" size={18} color="#d1d1d1"
                  style={{paddingRight: 20}}
                /> */}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 30,
                }}>
                <Menu
                  visible={this.state.visible}
                  onDismiss={() => this.setState({visible: false})}
                  anchor={
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => this.setState({visible: true})}>
                      <FontAwesome5
                        name={privacy === 'private' ? 'lock' : 'lock-open'}
                        size={16}
                      />
                      <Text
                        style={{
                          textAlignVertical: 'center',
                          textTransform: 'capitalize',
                          marginHorizontal: 3,
                        }}>
                        {privacy}
                      </Text>
                      <FontAwesome5
                        name="caret-down"
                        size={16}
                        style={{alignSelf: 'center'}}
                      />
                    </TouchableOpacity>
                  }>
                  <Menu.Item
                    onPress={() =>
                      this.setState({privacy: 'public', visible: false})
                    }
                    title="public"
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() =>
                      this.setState({privacy: 'private', visible: false})
                    }
                    title="private"
                  />
                </Menu>
              </View>
            </View>
            <View
              style={{
                flex: 5,
                //  borderBottomWidth: 0.5,
                borderBottomColor: 'grey',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 15,
              }}>
              {video.path === undefined ? (
                <View
                  style={{
                    justifyContent: 'center',
                    borderRadius: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.16)',
                    backgroundColor: '#fecbcb',
                    width: 287,
                    height: 218,
                    marginTop: 10,
                    marginBottom: 15,
                    elevation: 3,
                  }}>
                  <FontAwesome5
                    name="video"
                    color="#f48282"
                    size={50}
                    style={{alignSelf: 'center'}}
                    onPress={this.addVideo.bind(this)}
                  />
                </View>
              ) : (
                <Video
                  useTextureView={false}
                  source={{uri: video.path}} // Can be a URL or a local file.
                  ref={ref => {
                    this.player = ref;
                  }} // Store reference
                  // onBuffer={this.onBuffer} // Callback when remote video is buffering
                  // onError={this.videoError} // Callback when video cannot be loaded
                  style={styles.backgroundVideo}
                />
              )}
            </View>
            <View
              style={{
                borderTopWidth: 0.5,
                borderTopColor: 'grey',
                padding: 10,
              }}>
              <TextView
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins-Medium',
                  color: '#414141',
                }} text='Add Caption'>

              </TextView>
              <TextInput
                onChangeText={title => this.setState({title})}
                placeholder="write the video's title here"
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#bfbfbf',
                  width: '80%',
                  marginTop: Platform.OS === 'android' ? -12 : 0,
                  fontFamily: 'Poppins-Medium',
                  fontSize: 10,
                }}
              />
            </View>
            <View style={{padding: 10}}>
              <TextView
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins-Medium',
                  color: '#414141',
                }} text='Add Description'>
              </TextView>
              <TextInput
                onChangeText={description => this.setState({description})}
                placeholder="write a description here"
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#bfbfbf',
                  width: '80%',
                  marginTop: Platform.OS === 'android' ? -12 : 0,
                  fontFamily: 'Poppins-Medium',
                  fontSize: 10,
                }}
              />
            </View>
            {/* {this.props.tag || this.props.location && (<View style={{ height: 100, color: '#ededede' }} />)} */}

            <View
              style={{flex: 1.5, paddingLeft: 20, justifyContent: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <FontAwesome5 size={20} name="map-marker-alt" color="red" />
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: 'black',
                  }}>
                  {location.state ? location.state + ',' : null}
                  {location.country}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text
                  style={{
                    color: '#3e3e3e',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 11,
                  }}>
                  With:
                  {this.props.tag.map(e => (
                    <Text> @{e.username},</Text>
                  ))}
                </Text>
                {/* <Text>John bull</Text> */}
              </View>
            </View>

            <View
              style={{
                //  height: 50,
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 10,
              }}>
              {/*  <TouchableOpacity style={{ flexDirection: 'row' }}>
                <FontAwesome5
                  name="plus"
                  color="black"
                  size={13}
                  style={{ alignSelf: 'center', marginRight: 5}}
                />
              <Text style={{color: '#3e3e3e', fontSize: 13, fontFamily: 'Poppins-Medium'}}>
                    Add Hashtag
                  </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() =>
                  this.props.navigation.navigate('TagPeopleScreen')
                }>
                <FontAwesome5
                  name="plus"
                  color="black"
                  size={13}
                  style={{alignSelf: 'center', marginRight: 5}}
                />
                <TextView
                  style={{
                    color: '#3e3e3e',
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                  }} text='Tag People'>

                </TextView>
              </TouchableOpacity>

              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() =>
                  this.props.navigation.navigate('AddLocationRoute')
                }>
                <FontAwesome5
                  name="plus"
                  color="black"
                  size={13}
                  style={{alignSelf: 'center', marginRight: 5}}
                />
                <TextView
                  style={{
                    color: '#3e3e3e',
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                  }} text='Add Location'>
                  
                </TextView>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    // position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 300,
    width: 287,
  },
});

const mapStateToProps = state => ({
  location: state.addpost.locationdescription,
  tag: state.addpost.taggedpeople,
  signin: state.login.response,
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  username: state.profilepicture.username,
});

export default connect(
  mapStateToProps,
  {postValues, cleartaggedPeople, clearPostLocation},
)(withNavigation(VideoPost));
