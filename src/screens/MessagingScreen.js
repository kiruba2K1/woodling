import React from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import {GiftedChat, Time, Composer} from 'react-native-gifted-chat';

import {connect} from 'react-redux';
import axios from 'axios';
import firebase from 'react-native-firebase';
import {apiurl, imageurl} from '../constants/config';
import {Avatar, Menu, Divider, Portal, Modal} from 'react-native-paper';

import ImagePicker from 'react-native-image-crop-picker';
import {createIconSetFromFontello} from 'react-native-vector-icons';
const Customon = createIconSetFromFontello(fontelloConfig);
import fontelloConfig from '../config.json';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const {height, width} = Dimensions.get('window');
import {ConfirmDialog} from 'react-native-simple-dialogs';
import Toast from 'react-native-root-toast';
import Video1 from 'react-native-video';
import TextView from '../components/TextView';

class MessagingScreen extends React.Component {
  // static navigationOptions = ({ navigation }) => {
  //   const name = navigation.getParam('user', 'User');
  //   return {
  //     title: name.name
  //   };
  // };
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
    userStatus: 'offline',
    uName: '',
    dialogVisibleVideoChat: false,
    chatVideoPath: '',
  };

  renderTime(props) {
    return (
      <Time
        {...props}
        textStyle={{
          right: {
            color: 'black',
          },
          left: {
            color: 'white',
          },
        }}
      />
    );
  }

  // getUser=()=>{
  //   AsyncStorage.getItem("user",(error,result)=>{
  //     if(!error){
  //       var data=JSON.parse(result);
  //       if (data) {
  //         this.setState({
  //           id:data.id,
  //           profile_picture:data.profile_picture,
  //           username:data.username,
  //           loading: false ,
  //         });
  //         console.log("USER DATA : ",data);
  //       }
  //       else{
  //         this.setState({ loading: false });
  //       }
  //   }
  //   else{
  //     this.setState({ loading: false });
  //   }
  //   })
  // }

  getUserProfile() {}

  getTheirProfile() {}

  componentDidMount() {
    //this.getFireStoreData();
    //alert("DATA : UID = " + userId +" UserName = " + getUsername );
    this.setState({loading: true});
    //this.getUser();
    try {
      //StatusBar.setTranslucent(false);
      const {user_id, navigation} = this.props;
      const theirid = navigation.getParam('theirid');
      const user = navigation.getParam('user');
      const Screen = navigation.getParam('productDetails',false);
      console.log('-------- theirid : ', theirid);
      console.log('-------- user_id : ', user_id);

      // this.chatNotification = firebase
      //   .firestore()
      //   .collection("users")
      //   .doc(theirid)
      //   .collection("unreadMsg")
      //   .doc(user_id).set({count:50});
     // console.warn('User : ', user);
      //alert(JSON.stringify(user));
      this.setState({
        user: user,
        uName: Screen?user.full_name:user.name,
      });

      axios
        .get(
          `${apiurl}fetch-user-profile.php?user_id=${user_id}&user_profile_id=${theirid}`,
        )
        .then(res => {
          console.log('Their data from message : ', res.data);
          this.setState({theirData: res.data.data});

          axios
            .get(
              `${apiurl}fetch-user-profile.php?user_id=${user_id}&user_profile_id=${user_id}`,
            )
            .then(res1 => {
              console.log('Own data from message : ', res1.data);
              this.setState({ownData: res1.data.data, loading: false});
              this.getFireStoreData();
            })
            .catch(res1 => {
              console.log(res1.data);
              this.setState({loading: false});
            });
        })
        .catch(res => {
          console.log(res.data);
          this.setState({loading: false});
        });

      //alert("TheirID : " + theirid + "  My ID : " + user_id);
    } catch (error) {
      alert(error);
    }
  }
  getFireStoreData() {
    try {
      const {user_id, navigation} = this.props;
      const {theirData, ownData} = this.state;
      const theirid = navigation.getParam('theirid');
      const user = navigation.getParam('user');

      this.refStatus = firebase
        .firestore()
        .collection('users')
        .doc(theirid);

      this.refStatus.get().then(result => {
        this.setState({userStatus: result._data.user_status});
        ///alert(JSON.stringify(result._data.user_status));
      });

      this.refStatus.onSnapshot(
        docSnapshot => {
          console.log('Received doc snapshot: ', docSnapshot);
          console.log(
            'Firestore User id : ',
            docSnapshot._ref._documentPath._parts[1],
          );
          //alert(JSON.stringify(docSnapshot._data));
          try {
            this.setState({userStatus: docSnapshot._data.user_status});
          } catch (err) {
            console.log('Error in getting status : ', err);
            this.setState({userStatus: 'offline'});
          }
        },
        err => {
          console.log(`Encountered error: ${err}`);
        },
      );

      this.ref = firebase
        .firestore()
        .collection('users')
        .doc(user_id)
        .collection('chats')
        .doc(theirid)
        .collection('messages');

      this.chatlistref = firebase
        .firestore()
        .collection('users')
        .doc(user_id)
        .collection('chatlist')
        .doc(theirid);

      this.theirchatlistref = firebase
        .firestore()
        .collection('users')
        .doc(theirid)
        .collection('chatlist')
        .doc(user_id);

      const unsubscribe = this.ref.orderBy('createdAt', 'desc').onSnapshot(
        querySnapshot => {
          const messages = [];
          querySnapshot.forEach(element => {
            console.log(element.data());
            messages.push(element.data());
          });
          this.setState({messages});
          const listings = messages.filter(e => e.user._id !== user_id);
          if (messages[0] !== undefined) {
            const {text, createdAt} = messages[0];
            user.user_id = theirid;
            user.name = theirData.full_name;
            user.picture = imageurl + '/' + theirData.profile_picture;
            const datum = {text, createdAt, user};
            this.chatlistref.set(datum);
          }
        },
        err => {
          console.log(`Encountered error: ${err}`);
        },
      );

      const subscribe = this.ref.orderBy('createdAt', 'desc').onSnapshot(
        querySnapshot => {
          const messages = [];
          querySnapshot.forEach(element => {
            console.log(element.data());
            messages.push(element.data());
          });
          this.setState({messages});
          const listings = messages.filter(e => e.user._id !== user_id);
          if (messages[0] !== undefined) {
            const {text, createdAt} = messages[0];
            user.user_id = user_id;
            user.name = ownData.full_name;
            user.picture = imageurl + '/' + ownData.profile_picture;
            const datum = {text, createdAt, user};
            //alert("Send MSG : " + JSON.stringify(datum));
            this.theirchatlistref.set(datum);
          }
        },
        err => {
          console.log(`Encountered error: ${err}`);
        },
      );
    } catch (err) {
      console.log('Error in firestore : ', err);
    }
  }

  componentDidUpdate() {
    // console.log(this.state.messages);
  }

  onSend(messages = []) {
    const {user_id, navigation} = this.props;
    const theirid = navigation.getParam('theirid');

    this.chatNotification = firebase
      .firestore()
      .collection('users')
      .doc(theirid)
      .collection('unreadMsg')
      .doc(user_id);

    console.log('------------- callingChatNotificationget');
    this.chatNotification.get().then(querySnapshot => {
      console.log('-------- Query snapshot : ', querySnapshot.data());
      var count = querySnapshot.data();
      this.chatNotification.set(count + 1);
    });

    //  alert(user_id + " to " + theirid);

    this.ref = firebase
      .firestore()
      .collection('users')
      .doc(user_id)
      .collection('chats')
      .doc(theirid)
      .collection('messages');

    this.theirref = firebase
      .firestore()
      .collection('users')
      .doc(theirid)
      .collection('chats')
      .doc(user_id)
      .collection('messages');

    const chats = messages[0];
    const newMessage = {
      createdAt: Date.now(),
      text: chats.text,
      user: chats.user,
      _id: Date.now(),
    };
    console.log(newMessage);
    this.ref.add(newMessage).then(documentReference => {
      const {firestore} = documentReference;
      console.log(`Root location for document is ${firestore.formattedName}`);
    });
    this.theirref.add(newMessage).then(documentReference => {
      const {firestore} = documentReference;
      console.log(`Root location for document is ${firestore.formattedName}`);
    });
    // this.ref.add(chats);
    // this.chatlistref.set(messages[0]);
  }

  customSend(image, isVideo) {
    const {user_id, username, navigation} = this.props;
    const theirid = navigation.getParam('theirid');
    const user = {
      _id: user_id,
      name: username,
      avatar: 'https://facebook.github.io/react/img/logo_og.png',
    };

    this.chatNotification = firebase
      .firestore()
      .collection('users')
      .doc(theirid)
      .collection('unreadMsg')
      .doc('chatMsgCount');

    console.log(
      '------------- callingChatNotificationget',
      this.chatNotification,
    );
    this.chatNotification.get().then(
      querySnapshot => {
        if (querySnapshot.exists) {
          console.log('-------- Query snapshot : ', querySnapshot.data().count);
          var count = parseInt(querySnapshot.data().count);
          console.log('-------- Query Json : ', count);
          this.chatNotification.set({count: count + 1});
        } else {
          console.log('-------- Query snapshot : Not exists');
          this.chatNotification.set({count: 1});
        }
      },
      err => {
        console.log(`-----Encountered error: ${err}`);
      },
    );

    //  alert(user_id + " to " + theirid);

    this.ref = firebase
      .firestore()
      .collection('users')
      .doc(user_id)
      .collection('chats')
      .doc(theirid)
      .collection('messages');

    this.theirref = firebase
      .firestore()
      .collection('users')
      .doc(theirid)
      .collection('chats')
      .doc(user_id)
      .collection('messages');

    //const chats = messages[0];
    var newMessage = {};

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
    this.theirref.add(newMessage).then(documentReference => {
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

  renderMessageVideo(props) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            chatVideoPath: props.currentMessage.video,
            dialogVisibleVideoChat: true,
          })
        }>
        <Video1
          useTextureView={false}
          source={{uri: props.currentMessage.video}} // Can be a URL or a local file.
          ref={ref => {
            this.player = ref;
          }}
          muted={true}
          style={{height: 150, width: 150}}
          allowsExternalPlayback={false}
          paused={true}
        />
      </TouchableOpacity>
    );
  }
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
          this.setState({image: photo.uri, dialogVisible: true});
        } else {
          this.showToast('Please Upload Image Only.');
        }

        //this.setState({ image });
      })
      .catch(res => console.log(res.data));
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
    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiurl + 'upload-chat-image.php');
    xhr.onload = () => {
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
    formData.append('group_token', '3');

    xhr.send(formData);
    if (xhr.upload) {
      xhr.upload.onprogress = ({total, loaded}) => {
        const uploadProgress = ((loaded / total) * 100).toFixed(2);
        this.setState({imageProgress: uploadProgress});
        console.log(uploadProgress);
      };
    }
  }

  customSend(image, isVideo) {
    const {user_id, username, navigation} = this.props;
    const theirid = navigation.getParam('theirid');
    const user = {
      _id: user_id,
      name: username,
      avatar: 'https://facebook.github.io/react/img/logo_og.png',
    };

    this.ref = firebase
      .firestore()
      .collection('users')
      .doc(user_id)
      .collection('chats')
      .doc(theirid)
      .collection('messages');

    this.theirref = firebase
      .firestore()
      .collection('users')
      .doc(theirid)
      .collection('chats')
      .doc(user_id)
      .collection('messages');

    //const chats = messages[0];
    var newMessage = {};

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
    this.theirref.add(newMessage).then(documentReference => {
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
          this.setState({image: photo.uri, dialogVisible: true});
        } else {
          this.showToast('Please Upload Image Only.');
        }

        //this.setState({ image });
      })
      .catch(res => console.log(res.data));
  };

  chooseVideo() {
    //alert('test');
    //this.setState({ showModal: false });
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then(video => {
        console.log(video);
        // const c = image.path.split('/');
        // const len = c.length - 1;
        // const photo = {
        //   uri: image.path,
        //   type: image.mime,
        //   name: c[len],
        //   size: image.size,
        // };
        // console.log(photo);
        //
        // if( photo.uri.endsWith('.jpg') || photo.uri.endsWith('.jpeg') || photo.uri.endsWith('.png')){
        //   this.setState({ image: photo.uri,dialogVisible:true, });
        // }else{
        //   this.showToast("Please Upload Image Only.");
        // }

        //this.setState({ image });
        this.setState({video: video, dialogVisibleVideo: true});
      })
      .catch(res => console.log(res.data));
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
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      'http://woodlig.webbions.com/controllers/mobile/upload-chat-image.php',
    );
    xhr.onload = () => {
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
    formData.append('group_token', '3');

    xhr.send(formData);
    if (xhr.upload) {
      xhr.upload.onprogress = ({total, loaded}) => {
        const uploadProgress = ((loaded / total) * 100).toFixed(2);
        this.setState({imageProgress: uploadProgress});
        console.log(uploadProgress);
      };
    }
  }

  render() {
    const {user_id, username} = this.props;
    const {
      image,
      visible,
      privacy,
      showModal,
      video,
      user,
      theirData,
      chatVideoPath,
    } = this.state;
    return (
      <View style={{flex: 1}}>
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
            <Video1
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
            visible={this.state.dialogVisibleVideoChat}
            onDismiss={() => this.setState({dialogVisibleVideoChat: false})}>
            <View>
              <Video1
                useTextureView={false}
                source={{uri: chatVideoPath}} // Can be a URL or a local file.
                ref={ref => {
                  this.player = ref;
                }}
                style={styles.backgroundVideo}
              />
            </View>
          </Modal>
        </Portal>

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
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Customon
                  style={styles.arrowback}
                  name="long-arrow-left"
                  size={12}
                />
              </TouchableOpacity>
              <Text style={styles.title}>{this.state.uName} </Text>
              <TouchableOpacity></TouchableOpacity>
            </View>
            <View
              style={
                this.state.userStatus != undefined &&
                this.state.userStatus == 'online'
                  ? styles.userStatusOnline
                  : styles.userStatusOffline
              }
            />
          </View>

          <View style={{position: 'absolute'}}>
            {theirData != undefined && theirData.profile_picture != '' ? (
              <Avatar.Image
                style={{marginTop: 80}}
                size={30}
                rounded
                source={
                  theirData.profile_picture === ''
                    ? require('../images/Avatar_invisible_circle_1.png')
                    : {uri: `${imageurl}/${theirData.profile_picture}`}
                }
              />
            ) : (
              <Avatar.Image
                style={{marginTop: 80}}
                size={30}
                rounded
                source={require('../images/Avatar_invisible_circle_1.png')}
              />
            )}
          </View>
        </View>
        {this.state.loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : (
          <GiftedChat
            text={this.state.msgText}
            onInputTextChanged={text => this.setState({msgText: text})}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            showUserAvatar
            renderAvatar={null}
            renderTime={this.renderTime}
            renderUsernameOnMessage
            videoProps={{paused: true}}
            renderComposer={this.renderComposer}
            renderMessageVideo={props => this.renderMessageVideo(props)}
            user={{
              _id: user_id,
              name: username,
              avatar: 'https://facebook.github.io/react/img/logo_og.png',
            }}
          />
        )}
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
  backgroundVideo: {
    // position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 300,
    width,
  },
  header: {
    width: Dimensions.get('window').width,
    height: 65,
    //backgroundColor: '#ffff',

    alignItems: 'center',

    padding: 15,
    shadowOffset: {width: 3, height: 0},
    //elevation: 5,
  },
  header2: {
    width: Dimensions.get('window').width,
    height: 70,
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
    marginBottom: 15,
  },
  userStatusOffline: {
    marginTop: 2,
    backgroundColor: '#bbb',
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  userStatusOnline: {
    marginTop: 2,
    backgroundColor: '#0F0',
    height: 8,
    width: 8,
    borderRadius: 4,
  },
});

export default connect(mapStateToProps)(MessagingScreen);
