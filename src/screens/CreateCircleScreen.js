import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  StyleSheet,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import firebase from 'react-native-firebase';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Avatar, Menu, Divider, Portal, Modal} from 'react-native-paper';
import {connect} from 'react-redux';
import axios from 'axios';
import {apiurl, localurl, imageurl} from '../constants/config';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-root-toast';

import {createIconSetFromFontello} from 'react-native-vector-icons';
const Customon = createIconSetFromFontello(fontelloConfig);
import fontelloConfig from '../config.json';

import language from '../constants/language.js';
import TextView from '../components/TextView';

const uuidv4 = require('uuid/v4');

const {width, height} = Dimensions.get('window');
class CreateCircleScreen extends Component {
  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      privacy: 'public',
      circle_name: '',
      selected: [],
    };
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
    this.getUseProfile();
  }

  getUseProfile() {
    console.log('------ Call getUseProfile');
    const {navigation, user_id} = this.props;
    //const userid = navigation.getParam('user_id');
    axios
      .get(
        `${apiurl}fetch-user-profile.php?user_id=${user_id}&user_profile_id=${user_id}`,
      )
      .then(res => {
        console.log('user Profile : ', res.data);
        this.setState({profiledetails: res.data});
      })
      .catch(res => console.log(res));
  }

  // componentDidMount() {
  //   const { circle_name, privacy } = this.state;
  //   const { navigation } = this.props;
  //   const circle_type = navigation.getParam('selected', []);
  //   const members = navigation.getParam('category', []);
  //   this.ref = firebase
  //     .firestore()
  //     .collection('circles')
  //     .doc('6cdcc8c3-22b3-4120-a362-f414bbd735d5');

  //   this.ref.update({ circle_type: [{ name: 'abuja', id: 1 }] });
  //   // this.ref.onSnapshot(snap => console.log(snap.data()));
  //   // console.log(this.ref);
  // }

  createCircle = () => {
    const {circle_name, privacy} = this.state;
    const {navigation, user_id, full_name} = this.props;

    var path = 'https://image.flaticon.com/icons/png/512/69/69589.png';
    if (this.state.image != undefined && this.state.image != '') {
      path = this.state.image;
    }
    const date_created = Date.now();
    const circle_type = this.state.selected;
    const members = navigation.getParam('category', []);
    console.log('user_id : ', this.state.profiledetails.user_id);
    console.log('full_name : ', this.state.profiledetails.data.full_name);
    console.log('profile_thumb : ', '');
    console.log('username : ', this.state.profiledetails.data.username);
    console.log('rating : ', this.state.profiledetails.data.rating);
    console.log('follow_status : ', this.state.profiledetails.user_id);
    console.log('isAdmin : ', true);

    members.push({
      id: this.state.profiledetails.user_id,
      full_name: this.state.profiledetails.data.full_name,
      profile_thumb:
        this.state.profiledetails.profile_picture === ''
          ? 'https://pngimage.net/wp-content/uploads/2018/06/user-png-image-5.png'
          : imageurl + '/' + this.state.profiledetails.data.profile_picture,
      username: this.state.profiledetails.data.username,
      rating: this.state.profiledetails.data.rating,
      follow_status: this.state.profiledetails.user_id,
      isAdmin: true,
    });

    console.log(members);

    const groupkey = uuidv4();
    const groupExists = [];

    this.ref = firebase
      .firestore()
      .collection('circles')
      .doc(groupkey);

    this.keycheck = firebase.firestore().collection('circles');

    const data = {
      members,
      circle_name,
      circle_type,
      date_created,
      privacy,
      groupkey,
      path,
    };

    if (circle_name.length < 3) {
      return alert('Circle Name is too short');
    }

    const allCities = this.keycheck
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          groupExists.push(doc.id);
        });
        const exists = groupExists.filter(id => id === groupkey);
        if (exists.length > 0) throw 'the data already exists';
        else {
          this.ref.set(data).then(res => {
            // alert('working')
            const getDoc = this.ref
              .get()
              .then(doc => {
                if (!doc.exists) {
                  console.log('No such document!');
                } else {
                  // firebase
                  //   .firestore()
                  //   .collection('users')
                  //   .doc(user_id)
                  //   .collection('grouplist')
                  //   .add({ groupkey });
                  doc.data().members.forEach(element => {
                    firebase
                      .firestore()
                      .collection('users')
                      .doc(element.id)
                      .collection('grouplist')
                      .add({groupkey});
                  });
                  const {navigation} = this.props;
                  navigation.goBack();
                  navigation.state.params.onSelect(groupkey, circle_name);
                  //this.props.navigation.navigate('GroupMessage', { groupkey, circle_name });
                }
              })
              .catch(err => {
                console.log('Error getting document', err);
              });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  onSelect = data => {
    console.log('Data Received : ', data);
    this.setState({selected: data});
  };

  showToast(msg) {
    Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: 'red',
      textColor: 'white',
    });
  }

  fromGallery = () => {
    this.setState({showModal: false});
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        const c = image.path.split('/');
        const len = c.length - 1;
        const photo = {
          uri: image.path,
          type: image.mime,
          name: c[len],
          size: image.size,
        };
        console.log(photo);

        if (
          photo.uri.endsWith('.jpg') ||
          photo.uri.endsWith('.jpeg') ||
          photo.uri.endsWith('.png')
        ) {
          this._uploadSnap(photo.uri);
          this.setState({image: photo.uri, dialogVisible: true});
        } else {
          this.showToast('Please Upload Image Only.');
        }

        //this.setState({ image });
      })
      .catch(res => console.log(res.data));
  };

  fromCamera = () => {
    this.setState({showModal: false});
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        const c = image.path.split('/');
        const len = c.length - 1;
        const photo = {
          uri: image.path,
          type: image.mime,
          name: c[len],
          size: image.size,
        };
        console.log(photo);
        if (
          photo.uri.endsWith('.jpg') ||
          photo.uri.endsWith('.jpeg') ||
          photo.uri.endsWith('.png')
        ) {
          this._uploadSnap(photo.uri);
          this.setState({image: photo.uri, dialogVisible: true});
        } else {
          this.showToast('Please Upload Image Only.');
        }
      })
      .catch(res => console.log(res.data));
  };

  _uploadSnap(urlImage) {
    console.log('UploadSnap Called');
    //const { user_id, navigation } = this.props;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiurl + 'upload-chat-image.php');
    xhr.onload = () => {
      const response = JSON.parse(xhr.response);
      console.log('Success : ' + response.data.image_src);

      this.setState({imageProgress: 0, image: response.data.image_src});
    };
    xhr.onerror = e => {
      console.log(e, 'upload failed');
    };
    xhr.ontimeout = e => {
      console.log(e, 'cloudinary timeout');
    };
    const formData = new FormData();

    formData.append('chat_image', {
      uri: urlImage, // this is the path to your file. see Expo ImagePicker or React Native ImagePicker
      type: 'image/jpg', // example: image/jpg
      name: 'test.jpg', // example: upload.jpg
    });

    formData.append('user_id', '3');

    //console.log("Image Upload groupKey : ",groupkey);

    xhr.send(formData);
    if (xhr.upload) {
      xhr.upload.onprogress = ({total, loaded}) => {
        const uploadProgress = ((loaded / total) * 100).toFixed(2);
        this.setState({imageProgress: uploadProgress});
        console.log('Progress : ', uploadProgress);
      };
    }
  }

  render() {
    const {privacy, circle_name, lan} = this.state;
    const {navigation} = this.props;
    const selected = this.state.selected;
    const category = navigation.getParam('category', []);
    const {image, visible, showModal} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#808080'}}>
        <StatusBar
          backgroundColor="#ffffff"
          barStyle="dark-content"
          translucent={false}
        />
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
                  <TextView style={styles.pickerText} text="Gallery" />
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
                  <TextView style={styles.pickerText} text="Camera" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
        <View
          style={{
            height: '20%',
            justifyContent: 'space-evenly',
            paddingLeft: 20,
          }}>
          <FontAwesome5
            name="times"
            size={16}
            color="#414141"
            onPress={() => this.props.navigation.goBack()}
          />
          <TextView
            style={{
              color: '#3e3e3e',
              fontSize: 25,
              fontWeight: '700',
              textAlign: 'center',
            }}
            text="Create A Circle"
          />
        </View>
        <View
          style={{
            backgroundColor: '#ffffff',
            elevation: 2,
            height: '80%',
            justifyContent: 'space-between',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 30,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {this.state.image == undefined || this.state.image == '' ? (
              <TouchableOpacity
                onPress={() => this.setState({showModal: true})}>
                <Avatar.Icon
                  size={74}
                  style={{
                    borderColor: '#808080',
                    borderWidth: 1,
                    backgroundColor: '#d1d1d1',
                  }}
                  icon="camera-alt"
                />
              </TouchableOpacity>
            ) : (
              <Avatar.Image
                size={74}
                rounded
                source={{
                  uri: this.state.image,
                }}
                style={{marginTop: -15}}
                onPress={() => this.setState({showModal: true})}
              />
            )}

            <View>
              <TextView style={styles.inputHeader} text="Circle Name" />
              <TextInput
                style={{
                  color: 'black',
                  width: 234,
                  borderBottomWidth: 1,
                  padding: 0,
                }}
                value={circle_name}
                onChangeText={circle_name => this.setState({circle_name})}
                placeholder={language.promotions.enter_circle_name_here(lan)}
                placeholderTextColor="#dedede"
              />
            </View>
          </View>
          <View style={{alignSelf: 'flex-end'}}>
            <TextView style={styles.inputHeader} text="Circle Type" />
            <View style={styles.boxStyle}>
              <View style={{flex: 3}}>
                <ScrollView>
                  {selected.map(e => (
                    <Text>{e.name}</Text>
                  ))}
                </ScrollView>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderTopWidth: 1,
                  borderTopColor: '#dedede',
                }}>
                <FontAwesome5.Button
                  color="#808080"
                  backgroundColor="transparent"
                  name="plus"
                  onPress={() =>
                    this.props.navigation.navigate('SelectSkillType', {
                      prevstate: 'CreateACircle',
                      onSelect: this.onSelect,
                    })
                  }>
                  Add Category
                </FontAwesome5.Button>
              </View>
            </View>
          </View>
          <View style={{alignSelf: 'flex-end'}}>
            <TextView style={styles.inputHeader} text="Add Members" />
            <View style={styles.boxStyle}>
              <View style={{flex: 3}}>
                <ScrollView>
                  {category.map(e => (
                    <Text>{e.full_name}</Text>
                  ))}
                </ScrollView>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderTopWidth: 1,
                  borderTopColor: '#dedede',
                }}>
                <FontAwesome5.Button
                  color="#808080"
                  backgroundColor="transparent"
                  name="plus"
                  onPress={() =>
                    this.props.navigation.navigate('AddCircleMembers')
                  }>
                  Add People
                </FontAwesome5.Button>
              </View>
            </View>
          </View>
          <View style={{marginLeft: 120}}>
            <View style={{flexDirection: 'row'}}>
              <FontAwesome5.Button
                color={privacy === 'private' ? '#fb0201' : '#808080'}
                backgroundColor="transparent"
                name="lock"
                onPress={() => this.setState({privacy: 'private'})}>
                Private
              </FontAwesome5.Button>
              <FontAwesome5.Button
                color={privacy === 'public' ? '#fb0201' : '#808080'}
                backgroundColor="transparent"
                name="lock-open"
                onPress={() => this.setState({privacy: 'public'})}>
                Public
              </FontAwesome5.Button>
            </View>
          </View>
          <View style={{marginLeft: 120}}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.createCircle}>
              <TextView
                style={{fontWeight: '600', fontSize: 13, color: '#ffffff'}}
                text="Create Circle"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  boxStyle: {
    width: 234,
    height: 104,
    borderColor: '#d1d1d1',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  inputHeader: {
    fontSize: 15,
    fontWeight: '400',
    color: '#808080',
  },
  submitButton: {
    width: 139,
    height: 32,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {width: 3, height: 0},
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 6,
    borderRadius: 25,
    backgroundColor: '#fb0201',
  },
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
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  username: state.profilepicture.username,
});

export default connect(mapStateToProps)(CreateCircleScreen);
