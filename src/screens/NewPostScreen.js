/* eslint-disable indent */
/* eslint-disable react/prefer-stateless-function */
import React, {Component} from 'react';
import axios from 'axios';
import {Text, View, StatusBar, Alert, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {ScrollView} from 'react-native-gesture-handler';
import {Appbar, Portal, Modal, ActivityIndicator} from 'react-native-paper';
import fontelloConfig from '../config.json';
import {navigatePost} from '../redux/actions/navigatePost';
import VideoComponent from '../components/VideoComponent';
import PhotoComponent from '../components/PhotoComponent';
import ScriptComponent from '../components/ScriptComponent';
import EventComponent from '../components/EventComponent';
import RecordComponent from '../components/RecordComponent';
import SalesComponent from '../components/SalesComponent';
import VideoPost from '../components/VideoComponent2';
import {apiurl} from '../constants/config';
import {
  viewActivityStream,
  clearActivityStream,
} from '../redux/actions/viewActivityStream';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

export class NewPostScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      post_type: '',
      photostatus: [],
      videostatus: [],
      eventstatus: [],
      loadPercent: 0,
      loading: false,
    };
    this.photo = this.photo.bind(this);
    this.video = this.video.bind(this);
    this.script = this.script.bind(this);
    this.event = this.event.bind(this);
    this.sales = this.sales.bind(this);
    this.record = this.record.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const routeName = this.props.navigation.getParam('routeName');
    console.log(routeName);
    this.setState({post_type: routeName});
  }

  componentDidUpdate(a, b) {
    const {photostatus, videostatus, eventstatus} = this.state;
    // console.log(this.props.submitpost.postvalues)
    if (
      photostatus.status === 'success' ||
      videostatus.status === 'success' ||
      eventstatus.status === 'success'
    ) {
      this.props.navigation.goBack();
    } else if (photostatus.status === 'error') {
      alert(photostatus.message);
    } else if (videostatus.status === 'error') {
      alert(videostatus.message);
    } else if (eventstatus.status === 'error') {
      alert(eventstatus.message);
    }
  }

  async handleSubmit() {
    const {id, navigation, tag} = this.props;
    const {post_type} = this.state;
    const stringifyTaggedPeople = tag.map(element => element.id).toString();
    const {postvalues} = this.props.submitpost;
    console.log('-------------- PostValue', postvalues);
    const {location} = this.props;
    const formatted_address = location === '' ? '' : location.formatted_address;
    const city = location === '' ? '' : location.city;
    const country = location === '' ? '' : location.country;
    const lng = location === '' ? '' : location.lng;
    const lat = location === '' ? '' : location.lat;
    const user_id = id;
    const page = 1;
    const data = {user_id, page};

    if (post_type === 'script') {
      if (postvalues.synopsis === '') {
        return alert('Synopsis cannot be blank');
      }
      if (postvalues.synopsis_author === '') {
        return alert('Please enter an author');
      }
      if (postvalues.title === '') {
        return alert('Title cannot be blank');
      }
      await axios
        .post(`${apiurl}add-post.php?user_id=${id}`, postvalues)
        .then(res => {
          if (res.data.status === 'success') {
            this.props.clearActivityStream();
            this.props.viewActivityStream(data);
            alert(res.data.message);
            navigation.goBack();
          } else {
            alert(res.data.message);
          }
        })
        .catch(res => alert('unable to upload photo'));
    }
    if (post_type === 'sale') {
      console.warn(postvalues);
      if (postvalues.formatted_address === undefined)
        return alert('Please Select a location');
      if (postvalues.name === '')
        return alert('Product/Service name cannot be empty');
      if (postvalues.image.length === 0) return alert('image cannot be blank');
      if (postvalues.price === '0')
        return Alert.alert(
          `Price must be a value greater than ${postvalues.price}`,
        );
      if (postvalues.price === '')
        return Alert.alert('Please enter a valid price');
      const body = new FormData();
      postvalues.image.forEach((img, index) => {
        const c = img.path.split('/');
        const len = c.length - 1;
        var photo = {
          uri: img.path,
          type: img.mime,
          name: c[len],
          size: img.size,
        };
        body.append(`photo${index + 1}`, photo);
      });
      body.append('category', postvalues.category);
      body.append('city', postvalues.city);
      body.append('country', postvalues.country);
      body.append('currency', postvalues.currency);
      body.append('description', postvalues.description);
      body.append('formatted_address', postvalues.formatted_address);
      body.append('lat', postvalues.lat);
      body.append('lng', postvalues.lng);
      body.append('name', postvalues.name);
      // body.append('photo', postvalues.photo);
      body.append('price', postvalues.price);
      body.append('privacy', postvalues.privacy);
      body.append('product_type_id', postvalues.product_type_id);
      body.append('service_type_id', postvalues.service_type_id);
      body.append('purpose', postvalues.purpose);
      body.append('user_id', id);
      // console.log(body);
      this.setState({loading: true});
      await axios
        .post(`${apiurl}add-product.php`, body)
        .then(res => {
          if (res.data.status === 'success') {
            this.props.clearActivityStream();
            this.props.viewActivityStream(data);
            alert(res.data.message);
            navigation.goBack();
          } else {
            alert(res.data.message);
          }
        })
        .catch(res => alert('unable to upload photo'));
      this.setState({loading: false});
    }
    if (post_type === 'photo') {
      // console.warn(stringifyTaggedPeople);

      if (postvalues.image === undefined || postvalues.image.length === 0) {
        return alert('please select an image');
      }
      // if (postvalues.caption === '') return alert('caption cannot be blank');
      const body = new FormData();
      postvalues.image.forEach((img, index) => {
        const c = img.path.split('/');
        const len = c.length - 1;
        var photo = {
          uri: img.path,
          type: img.mime,
          name: c[len],
          size: img.size,
        };
        body.append(`photo${index + 1}`, photo);
      });

      // body.append('photo', photo);
      body.append('caption', postvalues.caption);
      body.append('type', 'photo');
      body.append('lng', lng);
      body.append('lat', lat);
      body.append('formatted_address', formatted_address);
      body.append('privacy', 'public');
      body.append('country', country);
      body.append('city', city);
      body.append('post_tagged_users', stringifyTaggedPeople);
      this.setState({loading: true});
      await axios
        .post(`${apiurl}add-post.php?user_id=${id}`, body, {
          onUploadProgress: progressEvent => {
            let val = progressEvent.loaded / progressEvent.total;
            this.setState({
              loadPercent: val.toPrecision(1),
            });
            // console.warn(
            //   `Upload Progress: ${Math.round(
            //     (progressEvent.loaded / progressEvent.total) * 100,
            //   )}%`,
            // );
          },
        })
        .then(res => {
          if (res.data.status === 'success') {
            this.props.clearActivityStream();
            this.props.viewActivityStream(data);
            alert(res.data.message);
            navigation.goBack();
          } else {
            alert(res.data.message);
          }
        })
        .catch(res => alert(res.data));
      this.setState({loading: false});
    }
    if (post_type === 'video') {
      console.log(postvalues);
      if (postvalues.video === undefined || postvalues.video.length === 0) {
        return alert('please select a video');
      }
      // if (postvalues.title === '') return alert('caption cannot be blank');
      // console.log(postvalues);
      const c = postvalues.video.path.split('/');
      const len = c.length - 1;
      const video = {
        uri: postvalues.video.path,
        type: postvalues.video.mime,
        name: c[len],
        size: postvalues.video.size,
      };
      const body = new FormData();
      body.append('video', video);
      body.append('caption', postvalues.title);
      body.append('description', postvalues.description);
      body.append('tag', stringifyTaggedPeople);
      body.append('type', 'video');
      body.append('lng', lng);
      body.append('lat', lat);
      body.append('formatted_address', formatted_address);
      body.append('privacy', 'public');
      body.append('country', country);
      body.append('city', city);

      this.setState({loading: true});
      await axios
        .post(`${apiurl}add-post.php?user_id=${id}`, body, {
          onUploadProgress: progressEvent => {
            let val = progressEvent.loaded / progressEvent.total;
            this.setState({
              loadPercent: val.toPrecision(1),
            });
          },
        })
        .then(res => {
          if (res.data.status === 'success') {
            this.props.clearActivityStream();
            this.props.viewActivityStream(data);
            alert(res.data.message);
            navigation.goBack();
          } else {
            alert(res.data.message);
          }
        })
        .catch(res => alert('unable to upload video'));
      this.setState({loading: false});
      console.log(body);
    }

    if (post_type === 'event') {
      console.warn(postvalues);
      if (postvalues.image === undefined) {
        return alert('All fields cannot be blank');
      }
      if (postvalues.date === '') {
        return alert('date cannot be empty');
      }
      if (postvalues.time === '') {
        return alert('time cannot be empty');
      }
      if (postvalues.eventname === '') {
        return alert('Event Title cannot be blank');
      }
      if (
        postvalues.formatted_address === '' ||
        postvalues.formatted_address === undefined
      ) {
        return alert('Enter a valid location');
      }
      const body = new FormData();
      if (postvalues.image !== '') {
        const c = postvalues.image.path.split('/');
        const len = c.length - 1;
        var photo = {
          uri: postvalues.image.path,
          type: postvalues.image.mime,
          name: c[len],
          size: postvalues.image.size,
        };
        body.append('photo', photo);
      }
      if (postvalues.image === '') {
        body.append('photo', '');
      }
      body.append('event_description', postvalues.description);
      body.append('event_name', postvalues.eventname);
      body.append('event_type', postvalues.eventtype);
      body.append('event_time', postvalues.time);
      body.append('event_date', postvalues.date);
      body.append('event_venue', postvalues.venue);
      body.append('type', 'event');
      body.append('lng', postvalues.lng);
      body.append('lat', postvalues.lat);
      body.append('formatted_address', formatted_address);
      body.append('privacy', 'public');
      body.append('country', country);
      body.append('city', city);
      this.setState({loading: true});
      await axios
        .post(`${apiurl}add-post.php?user_id=${id}`, body, {
          onUploadProgress: progressEvent => {
            let val = progressEvent.loaded / progressEvent.total;
            this.setState({
              loadPercent: val.toPrecision(1),
            });
          },
        })
        .then(res => {
          if (res.data.status === 'success') {
            this.props.clearActivityStream();
            this.props.viewActivityStream(data);
            alert(res.data.message);
            navigation.goBack();
          } else {
            alert(res.data.message);
          }
        })
        .catch(res => alert('unable to upload event'));
      this.setState({loading: false});
      // console.log(body);
    }
  }

  photo() {
    this.setState({post_type: 'photo'});
  }

  video() {
    this.setState({post_type: 'video'});
  }

  script() {
    const {script} = this.state;
    this.setState({post_type: 'script'});
  }

  event() {
    const {event} = this.state;
    this.setState({post_type: 'event'});
  }

  sales() {
    this.setState({post_type: 'sale'});
  }

  record() {
    this.setState({post_type: 'record'});
  }

  render() {
    const {post_type, loading, loadPercent} = this.state;
    return (
      <View>
        <Portal>
          <Modal visible={loading} dismissable={false}>
            <View
              style={{
                height: 150,
                width: 150,
                alignSelf: 'center',
                // justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Progress.Bar progress={loadPercent} color="red" width={140} />
              <Text style={{color: '#fff', fontSize: 15, textAlign: 'center'}}>
                {loadPercent * 100}%
              </Text>
            </View>
          </Modal>
        </Portal>
        <StatusBar
          translucent={false}
          backgroundColor="transparent"
          height={100}
        />
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => this.props.navigation.navigate('ActivityStream')}
          />
          <Appbar.Content
            titleStyle={{
              alignSelf: 'center',
              fontSize: 15,
              fontFamily: 'Poppins-Medium',
            }}
            title="NEW POST"
          />
          {/* <Appbar.Action icon="check" onPress={this.handleSubmit} /> */}
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              paddingVertical: 3,
              paddingHorizontal: 7,
              borderRadius: 5,
            }}
            onPress={this.handleSubmit}>
            <TextView style={{color: '#ffffff'}} text="Post" />
          </TouchableOpacity>
        </Appbar.Header>
        <View
          style={{
            borderWidth: 1,
            height: 50,
            borderColor: 'white',
            borderTopColor: '#dedede',
            borderBottomColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.43,
            shadowRadius: 9.51,

            elevation: 1,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={this.photo}>
              <Customon
                name="image-light"
                color={post_type === 'photo' ? 'red' : '#808080'}
                size={17}
              />
              <TextView
                style={{
                  textAlign: 'center',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: post_type === 'photo' ? 'red' : '#808080',
                }}
                text="Photo"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={this.video}>
              <Customon
                name="video-light"
                color={post_type === 'video' ? 'red' : '#808080'}
                size={17}
              />
              <TextView
                style={{
                  textAlign: 'center',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: post_type === 'video' ? 'red' : '#808080',
                }}
                text="Video"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.script}
              style={{alignItems: 'center'}}>
              <Customon
                name="quill_outline"
                color={post_type === 'script' ? 'red' : '#808080'}
                size={17}
              />
              <TextView
                style={{
                  textAlign: 'center',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: post_type === 'script' ? 'red' : '#808080',
                }}
                text="Script"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.event}
              style={{alignItems: 'center'}}>
              <Customon
                name="calendar-alt-light"
                color={post_type === 'event' ? 'red' : '#808080'}
                size={17}
              />
              <TextView
                style={{
                  textAlign: 'center',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: post_type === 'event' ? 'red' : '#808080',
                }}
                text="Event"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.sales}
              style={{alignItems: 'center'}}>
              <Customon
                name="shopping-cart-light"
                color={post_type === 'sale' ? 'red' : '#808080'}
                size={17}
              />
              <TextView
                style={{
                  textAlign: 'center',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: post_type === 'sale' ? 'red' : '#808080',
                }}
                text="Sell"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={this.record} style={{ alignItems: 'center' }}>
              <Customon name="video" color={post_type === 'record' ? 'red' : 'grey'} size={20} />
              <Text
                style={{
                  textAlign: 'center',
                  color: post_type === 'record' ? 'red' : 'grey'
                }}>
                Record
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View>
          {post_type === 'photo' && <PhotoComponent />}
          {post_type === 'video' && <VideoPost />}
          {post_type === 'script' && <ScriptComponent />}
          {post_type === 'event' && <EventComponent />}
          {post_type === 'sale' && <SalesComponent />}
          {post_type === 'record' && <RecordComponent />}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  newPostRoute: state.newpostnavigation.newpostroute,
  submitpost: state.addpost,
  location: state.addpost.locationdescription,
  tag: state.addpost.taggedpeople,
  id: state.userid.id,
});

export default connect(mapStateToProps, {
  viewActivityStream,
  clearActivityStream,
})(NewPostScreen);
