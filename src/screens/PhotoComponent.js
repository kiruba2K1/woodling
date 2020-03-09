import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Picker,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Avatar, Menu, Divider, Portal, Modal} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {postValues} from '../redux/actions/handleYourMind';
import Dropdown from './Dropdown';
import {imageurl} from '../constants/config';
import fontelloConfig from '../config.json';
import Toast from 'react-native-root-toast';
import Swiper from 'react-native-swiper';
import TextView from '../components/TextView';

const {height, width} = Dimensions.get('window');
const Customon = createIconSetFromFontello(fontelloConfig);

export class PhotoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: [],
      longlat: [],
      caption: '',
      visible: false,
      privacy: 'public',
      showModal: false,
    };
  }

  componentDidUpdate(prevprops) {
    const {location} = this.props;
    const {longlat, image, caption} = this.state;
    const total = {
      image,
      caption,
    };
    this.props.postValues(total);
  }

  // addPhoto() {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //   }).then(image => {
  //     this.setState({image});
  //   });
  // ImagePicker.openCamera({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //   }).then(image => {
  //     this.setState({ image });
  //   });
  // }

  fromGallery = () => {
    this.setState({showModal: false});
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true,
      mediaType: 'photo',
      maxFiles: 5,
    })
      .then(image => {
        // const c = image.path.split('/');
        // const len = c.length - 1;
        // const photo = {
        //   uri: image.path,
        //   type: image.mime,
        //   name: c[len],
        //   size: image.size,
        // };
        if (image.length <= 5) this.setState({image});
        else
          Toast.show('You can only add 5 pictures at a time', {
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
      .catch(res => console.warn(res));
  };

  fromCamera = () => {
    this.setState({showModal: false});
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      multiple: true,
      mediaType: 'photo',
      maxFiles: 5,
    })
      .then(image => {
        // const c = image.path.split('/');
        // const len = c.length - 1;
        // const photo = {
        //   uri: image.path,
        //   type: image.mime,
        //   name: c[len],
        //   size: image.size,
        // };
        if (image.length <= 5) this.setState({image});
        else
          Toast.show('You can only add 5 pictures at a time', {
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
      .catch(res => console.warn(res));
  };

  render() {
    const {location, tag, profilepicture, username} = this.props;
    const {image, visible, privacy, showModal} = this.state;
    return (
      <ScrollView contentContainerStyle={{height}}>
        <Portal>
          <Modal
            visible={showModal}
            onDismiss={() => this.setState({showModal: false})}>
            <View style={{alignSelf: 'center'}}>
              <View style={styles.imagePicker}>
                <TouchableOpacity
                  onPress={this.fromGallery}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRightWidth: 0.5,
                  }}>
                  <Customon name="images" size={40} />
                  <TextView style={styles.pickerText} text='Gallery' />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.fromCamera}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderLeftWidth: 0.5,
                  }}>
                  <Customon name="camera-alt" size={40} />
                  <TextView style={styles.pickerText} text='Camera' />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
        <View style={{height: height - 130, backgroundColor: '#eeeeee'}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                height: '90%',
                width: '95%',
                borderRadius: 20,
                backgroundColor: '#ffffff',
                elavation: 10,
              }}>
              <View
                style={{
                  flex: 1.5,
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
                {/*<FontAwesome5 name="image" size={18} color="#d1d1d1" style={{ paddingRight: 20 }} />*/}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 30,
                    paddingBottom: 15,
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
                            fontFamily: 'Poppins-Medium',
                            fontSize: 13,
                            marginLeft: 5,
                            color: '#808080',
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
                  flex: 6,
                  borderBottomWidth: 0.5,
                  borderBottomColor: 'grey',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 15,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    flex: 2,
                    width: '80%',
                    borderRadius: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.16)',
                    backgroundColor: '#fecbcb',
                    // width: 287,
                    // height: 218,
                    marginBottom: 15,
                    elevation: 3,
                  }}>
                  {image.length === 0 ? (
                    <TouchableOpacity
                      style={{alignSelf: 'center'}}
                      onPress={() => this.setState({showModal: true})}>
                      <FontAwesome5
                        name="camera-retro"
                        color="#f48282"
                        size={50}
                        style={{alignSelf: 'center'}}
                      />
                      {/* <Text style={{ textAlign: 'center' }}>Add Photo(s)</Text> */}
                    </TouchableOpacity>
                  ) : (
                    <Swiper horizontal>
                      {image.map(value => {
                        return (
                          <Image
                            style={{
                              height: '100%',
                              width: '100%',
                              borderRadius: 20,
                            }}
                            source={{uri: value.path}}
                          />
                        );
                      })}
                    </Swiper>
                  )}
                </View>

                {/* <View style={{flexDirection: 'row'}}>
                  <FontAwesome5
                    name="plus-circle"
                    size={16}
                    color="#fb0201"
                  />
                <Text style={{ textAlign: 'center', marginLeft: 8,
                  color: '#fb0201', fontFamily: 'Poppins-Medium', fontSize: 13}}>Add Photo(s)</Text>
                </View> */}
              </View>

              <View
                style={{
                  flex: 2,
                  paddingLeft: 20,
                  justifyContent: 'center',
                  paddingTop: 10,
                }}>
                <TextView
                  style={{
                    fontSize: 20,
                    fontFamily: 'Poppins-Medium',
                    color: '#414141',
                  }} text='Add Caption' />
                <TextInput
                  onChangeText={text => this.setState({caption: text})}
                  placeholder="Rainy days occur every..."
                  placeholderTextColor="#bfbfbf"
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#bfbfbf',
                    width: '80%',
                    marginTop: -12,
                    fontFamily: 'Poppins-Medium',
                    fontSize: 10,
                  }}
                />
              </View>
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
                    &nbsp;{location.state ? location.state + ',' : null}{' '}
                    {location.country}
                  </Text>
                </View>

                {tag.length !== 0 && (
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <TextView
                      style={{
                        color: '#3e3e3e',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                      }} text='With:' />

                    {tag.length <= 2 ? (
                      <View style={{flexDirection: 'row'}}>
                        {tag.map(e => (
                          <Text
                            style={{
                              color: '#3e3e3e',
                              fontFamily: 'Poppins-Medium',
                              fontSize: 11,
                            }}
                            key={e.id}>
                            &nbsp;@{e.username}&nbsp;,
                          </Text>
                        ))}
                      </View>
                    ) : (
                      <View style={{flexDirection: 'row'}}>
                        {tag.slice(0, 2).map(e => (
                          <Text key={e.id}>&nbsp;{e.username}&nbsp;</Text>
                        ))}
                        <Text>and {tag.length - 2} more&nbsp;</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                {/*   <TouchableOpacity style={{ flexDirection: 'row' }}>
                  <FontAwesome5
                    name="plus"
                    color="black"
                    size={13}
                    style={{ alignSelf: 'center', marginRight: 5 }}
                  />
                 <Text style={{ color: '#3e3e3e', fontSize: 13, fontFamily: 'Poppins-Meduim' }}>
                    Add Hashtag
                  </Text>
                </TouchableOpacity>*/}
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
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <TextView
                      style={{
                        color: '#3e3e3e',
                        fontSize: 13,
                        fontFamily: 'Poppins-Medium',
                      }} text='Tag People' />
                  </View>
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
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <TextView
                      style={{
                        color: '#3e3e3e',
                        fontSize: 13,
                        fontFamily: 'Poppins-Medium',
                      }} text='Add Location' />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  imagePicker: {
    width: 209,
    height: 123,
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  pickerText: {
    color: '#000000',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
});

const mapStateToProps = state => ({
  location: state.addpost.locationdescription,
  tag: state.addpost.taggedpeople,
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  username: state.profilepicture.username,
});

export default connect(
  mapStateToProps,
  {postValues},
)(withNavigation(PhotoComponent));
