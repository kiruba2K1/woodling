import React from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {GiftedChat, Bubble, Time, Composer} from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import axios from 'axios';
import firebase from 'react-native-firebase';
import {apiurl} from '../constants/config';
import {Avatar, Menu, Divider, Portal, Modal} from 'react-native-paper';

import ImagePicker from 'react-native-image-crop-picker';
import {createIconSetFromFontello} from 'react-native-vector-icons';
const Customon = createIconSetFromFontello(fontelloConfig);
import fontelloConfig from '../config.json';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const {height, width} = Dimensions.get('window');
import {ConfirmDialog} from 'react-native-simple-dialogs';
import Toast from 'react-native-root-toast';
import Video from 'react-native-video';
import TextView from '../components/TextView';

class GroupMessagingScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      //title: navigation.getParam('circle_name', 'Group')
      header: null,
    };
  };

  state = {
    msgText: '',
    messages: [],
    showModal: false,
    image: null,
    dialogVisible: false,
    imageProgress: 0,
    dialogVisibleVideo: false,
    video: '',
  };

  componentDidMount() {
    StatusBar.setTranslucent(false);
    const {navigation, user_id} = this.props;
    const groupKey = navigation.getParam('groupkey');
    console.log(groupKey);
    this.ref = firebase
      .firestore()
      .collection('circles')
      .doc(groupKey)
      .collection('messages');

    try {
      this.newref = firebase
        .firestore()
        .collection('circles')
        .doc(groupKey)
        .get()
        .then(snapshot => {
          //const data = snapshot.data();
          // console.log(datum);
          //data.push(datum);
          console.log('------ Data : ', snapshot.data().members);
          //this.setState({ chatlist: data });
        });

      //  console.log(data);
    } catch (error) {
      alert(error);
    }

    const unsubscribe = this.ref.orderBy('createdAt', 'desc').onSnapshot(
      querySnapshot => {
        const messages = [];
        querySnapshot.forEach(element => {
          console.log(element.data());
          messages.push(element.data());
        });
        this.setState({messages});
      },
      err => {
        console.log(`Encountered error: ${err}`);
      },
    );
  }

  onSend(messages = []) {
    const {navigation} = this.props;
    const groupkey = navigation.getParam('groupkey');

    this.ref = firebase
      .firestore()
      .collection('circles')
      .doc(groupkey)
      .collection('messages');

    const chats = messages[0];
    const newMessage = {
      createdAt: Date.now(),
      text: chats.text,
      user: chats.user,
      _id: chats._id,
    };
    console.log(newMessage);
    this.ref.add(newMessage).then(documentReference => {
      const {firestore} = documentReference;
      console.log(`Root location for document is ${firestore.formattedName}`);
    });
  }

  customSend(image, isVideo) {
    const {user_id, username, navigation} = this.props;
    const groupkey = navigation.getParam('groupkey');
    const user = {
      _id: user_id,
      name: username,
      avatar: 'https://facebook.github.io/react/img/logo_og.png',
    };

    this.ref = firebase
      .firestore()
      .collection('circles')
      .doc(groupkey)
      .collection('messages');

    var newMessage = {};

    // if(image!=undefined){
    //   newMessage = {
    //     image: image,
    //     createdAt: Date.now(),
    //     text: this.state.msgText,
    //     user: user,
    //     _id: Date.now(),
    //   };
    // }else{
    //   newMessage = {
    //     createdAt: Date.now(),
    //     text: this.state.msgText,
    //     user: user,
    //     _id: Date.now(),
    //   };
    // }

    if (image != undefined && isVideo == false) {
      newMessage = {
        image: image,
        createdAt: Date.now(),
        text: this.state.msgText,
        user: user,
        _id: Date.now(),
      };
    } else if (isVideo) {
      newMessage = {
        video: image,
        createdAt: Date.now(),
        text: this.state.msgText,
        user: user,
        _id: Date.now(),
      };
    } else {
      newMessage = {
        createdAt: Date.now(),
        text: this.state.msgText,
        user: user,
        _id: Date.now(),
      };
    }

    console.log(newMessage);
    this.ref.add(newMessage).then(documentReference => {
      const {firestore} = documentReference;
      console.log(`Root location for document is ${firestore.formattedName}`);
    });
    this.setState({msgText: ''});
  }

  renderComposer = props => {
    return (
      <View style={styles.sendBox}>
        <FontAwesome5
          style={styles.sendBoxImage}
          onPress={() => this.chooseVideo()}
          name="video"
          size={22}
        />
        <FontAwesome5
          style={styles.sendBoxImage}
          onPress={() => this.setState({showModal: true})}
          name="paperclip"
          size={22}
        />
        <Composer
          style={{borderColor: 'red', backgroundColor: 'red'}}
          {...props}
        />
        <FontAwesome5
          style={styles.sendBoxImage}
          color="red"
          name="paper-plane"
          size={22}
          onPress={() => this.customSend()}
        />
      </View>
    );
  };

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
          this.setState({image: photo.uri, dialogVisible: true});
        } else {
          this.showToast('Please Upload Image Only.');
        }

        //this.setState({ image });
      })
      .catch(res => console.log(res.data));
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
          this.setState({image: photo.uri, dialogVisible: true});
        } else {
          this.showToast('Please Upload Image Only.');
        }
      })
      .catch(res => console.log(res.data));
  };

  _uploadSnap(isVideo) {
    const {user_id, navigation} = this.props;
    const groupkey = navigation.getParam('groupkey');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiurl + 'upload-chat-image.php');
    xhr.onload = () => {
      // const response = JSON.parse(xhr.response);
      // console.log("Success : " + response.data.image_src);
      //
      // var messages = [];
      // this.customSend(response.data.image_src)
      // this.setState({msgText:'',dialogVisible:false,imageProgress:0});

      console.log('Success : ', xhr.response);
      const response = JSON.parse(xhr.response);
      console.log('Success : ', response.data);
      if (isVideo) {
        this.customSend(response.data.video_src, isVideo);
      } else {
        this.customSend(response.data.image_src, isVideo);
      }
      this.setState({
        msgText: '',
        dialogVisible: false,
        imageProgress: 0,
        dialogVisibleVideo: false,
      });
    };
    xhr.onerror = e => {
      console.log(e, 'upload failed');
    };
    xhr.ontimeout = e => {
      console.log(e, 'cloudinary timeout');
    };
    const formData = new FormData();

    if (isVideo) {
      const c = this.state.video.path.split('/');
      const len = c.length - 1;
      formData.append('chat_video', {
        uri: this.state.video.path, // this is the path to your file. see Expo ImagePicker or React Native ImagePicker
        type: this.state.video.mime, // example: image/jpg
        name: c[len], // example: upload.jpg
      });
    } else {
      formData.append('chat_image', {
        uri: this.state.image, // this is the path to your file. see Expo ImagePicker or React Native ImagePicker
        type: 'image/jpg', // example: image/jpg
        name: 'test.jpg', // example: upload.jpg
      });
    }

    formData.append('user_id', '3');
    formData.append('user_id', user_id);
    formData.append('group_token', groupkey);

    console.log('Image Upload groupKey : ', groupkey);

    xhr.send(formData);
    if (xhr.upload) {
      xhr.upload.onprogress = ({total, loaded}) => {
        const uploadProgress = ((loaded / total) * 100).toFixed(2);
        this.setState({imageProgress: uploadProgress});
        console.log(uploadProgress);
      };
    }
  }

  onSelect = (groupkey, circle_name) => {
    const {navigation} = this.props;
    navigation.goBack();
    navigation.state.params.onSelect();
  };

  chooseVideo() {
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then(video => {
        console.log(video);
        this.setState({video: video, dialogVisibleVideo: true});
      })
      .catch(res => console.log(res.data));
  }

  customSend(image) {
    const {user_id, username, navigation} = this.props;
    const groupkey = navigation.getParam('groupkey');
    const user = {
      _id: user_id,
      name: username,
      avatar: 'https://facebook.github.io/react/img/logo_og.png',
    };

    this.ref = firebase
      .firestore()
      .collection('circles')
      .doc(groupkey)
      .collection('messages');

    var newMessage = {};

    if (image != undefined) {
      newMessage = {
        image: image,
        createdAt: Date.now(),
        text: this.state.msgText,
        user: user,
        _id: Date.now(),
      };
    } else {
      newMessage = {
        createdAt: Date.now(),
        text: this.state.msgText,
        user: user,
        _id: Date.now(),
      };
    }

    console.log(newMessage);
    this.ref.add(newMessage).then(documentReference => {
      const {firestore} = documentReference;
      console.log(`Root location for document is ${firestore.formattedName}`);
    });
    this.setState({msgText: ''});
  }

  renderComposer = props => {
    return (
      <View style={styles.sendBox}>
        <FontAwesome5
          style={styles.sendBoxImage}
          onPress={() => this.setState({showModal: true})}
          name="paperclip"
          size={22}
        />
        <Composer
          style={{borderColor: 'red', backgroundColor: 'red'}}
          {...props}
        />
        <FontAwesome5
          style={styles.sendBoxImage}
          color="red"
          name="paper-plane"
          size={22}
          onPress={() => this.customSend()}
        />
      </View>
    );
  };

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
          this.setState({image: photo.uri, dialogVisible: true});
        } else {
          this.showToast('Please Upload Image Only.');
        }

        //this.setState({ image });
      })
      .catch(res => console.log(res.data));
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
          this.setState({image: photo.uri, dialogVisible: true});
        } else {
          this.showToast('Please Upload Image Only.');
        }
      })
      .catch(res => console.log(res.data));
  };

  _uploadSnap() {
    const {user_id, navigation} = this.props;
    const groupkey = navigation.getParam('groupkey');
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      'http://woodlig.webbions.com/controllers/mobile/upload-chat-image.php',
    );
    xhr.onload = () => {
      const response = JSON.parse(xhr.response);
      console.log('Success : ' + response.data.image_src);

      var messages = [];
      this.customSend(response.data.image_src);
      this.setState({msgText: '', dialogVisible: false, imageProgress: 0});
    };
    xhr.onerror = e => {
      console.log(e, 'upload failed');
    };
    xhr.ontimeout = e => {
      console.log(e, 'cloudinary timeout');
    };
    const formData = new FormData();

    formData.append('chat_image', {
      uri: this.state.image, // this is the path to your file. see Expo ImagePicker or React Native ImagePicker
      type: 'image/jpg', // example: image/jpg
      name: 'test.jpg', // example: upload.jpg
    });

    formData.append('user_id', '3');
    formData.append('user_id', user_id);
    formData.append('group_token', groupkey);

    console.log('Image Upload groupKey : ', groupkey);

    xhr.send(formData);
    if (xhr.upload) {
      xhr.upload.onprogress = ({total, loaded}) => {
        const uploadProgress = ((loaded / total) * 100).toFixed(2);
        this.setState({imageProgress: uploadProgress});
        console.log(uploadProgress);
      };
    }
  }

  onSelect = (groupkey, circle_name) => {
    const {navigation} = this.props;
    navigation.goBack();
    navigation.state.params.onSelect();
  };

  render() {
    const {user_id, navigation, username, circle_name} = this.props;
    const groupkey = navigation.getParam('groupkey');
    //navigation.getParam('circle_name', 'Group')
    const {image, visible, privacy, showModal, video} = this.state;
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="#ffffff"
          barStyle="dark-content"
          translucent={false}
        />
        <ConfirmDialog
          title="Share Image"
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{
            title: 'Send',
            onPress: () => this._uploadSnap(false),
          }}
          negativeButton={{
            title: 'Cancel',
            onPress: () => this.setState({dialogVisible: false}),
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{uri: this.state.image}}
              style={{height: 200, width: 200, backgroundColor: 'black'}}
            />
            {this.state.imageProgress > 0 ? (
              <View style={{flexDirection: 'row'}}>
                <TextView style={{margin: 10}} text="Sending..." />
                <Text style={{margin: 10}}> {this.state.imageProgress} %</Text>
              </View>
            ) : (
              <View />
            )}
          </View>
        </ConfirmDialog>
        <ConfirmDialog
          title="Share Video"
          visible={this.state.dialogVisibleVideo}
          onTouchOutside={() => this.setState({dialogVisibleVideo: false})}
          positiveButton={{
            title: 'Send',
            onPress: () => this._uploadSnap(true),
          }}
          negativeButton={{
            title: 'Cancel',
            onPress: () => this.setState({dialogVisibleVideo: false}),
          }}>
          <View style={{alignItems: 'center'}}>
            <Video
              useTextureView={false}
              source={{uri: video.path}} // Can be a URL or a local file.
              ref={ref => {
                this.player = ref;
              }}
              style={styles.backgroundVideo}
            />
            {this.state.imageProgress > 0 ? (
              <View style={{flexDirection: 'row'}}>
                <TextView style={{margin: 10}} text="Sending..." />
                <Text style={{margin: 10}}> {this.state.imageProgress} %</Text>
              </View>
            ) : (
              <View />
            )}
          </View>
        </ConfirmDialog>
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

        <View style={styles.header2}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Customon
                style={styles.arrowback}
                name="long-arrow-left"
                size={12}
              />
            </TouchableOpacity>
            <Text style={styles.title}>
              {this.props.navigation.getParam('circle_name', 'Group')}{' '}
            </Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.push('CirclesAdmin', {
                  user_id: user_id,
                  groupkey: groupkey,
                  name: this.props.navigation.getParam('circle_name', 'Group'),
                  path: this.props.navigation.getParam('path', ''),
                  onSelect: this.onSelect,
                })
              }>
              <FontAwesome5 style={styles.arrowback2} name="cog" size={20} />
            </TouchableOpacity>
          </View>

          {this.props.navigation.getParam('path', '') != '' ? (
            <Avatar.Image
              size={30}
              rounded
              source={{
                uri: this.props.navigation.getParam('path', ''),
              }}
              style={{marginTop: -15}}
            />
          ) : (
            <Avatar.Image
              size={30}
              rounded
              source={{
                uri:
                  'https://pngimage.net/wp-content/uploads/2018/06/user-png-image-5.png',
              }}
              style={{marginTop: -15}}
            />
          )}
        </View>

        {
          // <View style={styles.header}>
          //     <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
          //       <Customon style={styles.arrowback} name="long-arrow-left" size={12} />
          //     </TouchableOpacity>
          //     <Text style={{height:20}}> {this.props.navigation.getParam('circle_name', 'Group')} </Text>
          //     <TouchableOpacity>
          //       <FontAwesome5 style={styles.arrowback} name="ellipsis-v" size={20} />
          //     </TouchableOpacity>
          // </View>
          // <View style={styles.headerProfile}>
          //     <Image
          //       source={require('../images/ic_account_circle_24px.jpg')}
          //       style={{ width: 35, height: 35,  }}/>
          // </View>
        }

        <GiftedChat
          text={this.state.msgText}
          onInputTextChanged={text => this.setState({msgText: text})}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          showUserAvatar
          renderAvatar={null}
          videoProps={{paused: true}}
          renderTime={this.renderTime}
          renderUsernameOnMessage
          renderComposer={this.renderComposer}
          user={{
            _id: user_id,
            name: username,
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  username: state.profilepicture.username,
});

const styles = StyleSheet.create({
  sendBox: {
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 7,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    borderColor: '#eeeeee',
    borderWidth: 1,
    elevation: 5,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendBoxImage: {
    paddingLeft: 5,
    paddingRight: 5,
    margin: 3,
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
  header: {
    width: Dimensions.get('window').width,
    height: 65,
    //backgroundColor: '#ffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: {width: 3, height: 0},
    //elevation: 5,
  },

  header2: {
    width: Dimensions.get('window').width,
    height: 65,
    backgroundColor: '#ffff',
    shadowOpacity: 1,
    //justifyContent: 'space-between',
    //alignItems: 'center',
    //flexDirection: 'row',
    //padding: 15,
    paddingTop: 10,
    shadowOffset: {width: 3, height: 0},
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowback: {
    color: '#000',
  },
  headerProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -3,
  },
  backgroundVideo: {
    // position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 300,
    width,
  },
});

export default connect(mapStateToProps)(GroupMessagingScreen);
