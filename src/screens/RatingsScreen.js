import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  AsyncStorage
} from 'react-native';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import {createIconSetFromFontello} from 'react-native-vector-icons';

import {Appbar, Avatar, RadioButton, Portal, Modal} from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import {connect} from 'react-redux';
import fontelloConfig from '../config.json';
import {apiurl, imageurl} from '../constants/config.js';
import {fetchUserProfileReviews} from '../redux/actions/fetchUserProfileReview';
import TextView from '../components/TextView';
import language from "../constants/language.js"
const Customon = createIconSetFromFontello(fontelloConfig);

const {height, width} = Dimensions.get('window');

class RatingsScreen extends Component {
  state = {
    checked: 5,
    review: '',
    visible: false,
  };

  componentDidMount() {
    // const { navigation } = this.props;
    // const profiledetail = navigation.getParam('profiledetail');
    // console.log(profiledetail);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );

    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if(value == 'fr'){
          this.setState({
            lan:'fr',
          });
        }else{
          this.setState({
            lan:'en',
          });
        }
      }else{
        alert("Else exicute : " + value);
      }
    } catch (error) {
      //alert("error");
      console.log("--------- Error",error);
      // Error retrieving data
    }
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidUpdate() {
    console.log(this.state.checked);
  }

  _keyboardDidShow() {
    // alert('Keyboard Shown');
    this.scroll.scrollToEnd();
  }

  _keyboardDidHide() {
    this.scroll.scrollToEnd();
    // alert('Keyboard Hidden');
  }

  onFocus = () => {
    // ScrollView.scrollToEnd({ animated: true, duration: 500 });
  };

  _hideModal = () => {
    const {visible} = this.state;
    this.setState({visible: !visible});
  };

  async submitRating() {
    const {user_id, navigation} = this.props;
    const recipient_id = navigation.getParam('recipient_id');
    // console.log(recipient_id);
    const {review, checked} = this.state;
    const rate = checked;
    const data = {user_id, recipient_id, rate, review};
    const user_profile_id = recipient_id;
    const refreshratings = {user_id, user_profile_id};
    // console.log(data);

    this.setState({visible: true});
    await axios
      .post(`${apiurl}add-review.php`, data)
      .then(res => {
        // console.warn(data);
        if (res.data.status === 'success') {
          this.setState({review: ''});
          this.props.fetchUserProfileReviews(refreshratings);
          navigation.goBack();
        }
        alert(res.data.message);
      })
      .catch(res => {
        Toast.show('An error occured', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        });
      });
    this.setState({visible: false});
  }

  render() {
    const {checked, review, visible,lan} = this.state;
    const {navigation} = this.props;
    const profiledetail = navigation.getParam('profiledetail');
    return (
      <View>
        <StatusBar
          translucent={false}
          backgroundColor="white"
          barStyle="dark-content"
        />
        <Portal>
          <Modal visible={visible} onDismiss={this._hideModal}>
            <View style={styles.modalStyle}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          </Modal>
        </Portal>
        <Appbar.Header style={{height: 80, justifyContent: 'space-around'}}>
          <View style={{flex: 1, marginLeft: 10}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Customon name="long-arrow-left" size={15} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <TouchableOpacity style={{}}>
              <Avatar.Image
                size={40}
                source={
                  profiledetail.profile_picture === ''
                    ? require('../images/Avatar_invisible_circle_1.png')
                    : {uri: `${imageurl}/${profiledetail.profile_picture}`}
                }
                style={{
                  borderWidth: 2,
                  borderColor:
                    profiledetail.premium === '1' ? '#fb0201' : '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              />
            </TouchableOpacity>
            <Text style={{textAlign: 'center'}}>{profiledetail.username}</Text>
          </View>
          <View style={{flex: 1}} />
        </Appbar.Header>
        <ScrollView
          ref={scroll => {
            this.scroll = scroll;
          }}
          contentContainerStyle={{height: height - 20}}>
          <RadioButton.Group
            onValueChange={checked => this.setState({checked})}
            value={this.state.checked}>
            <View style={styles.radioContainer}>
              <View style={{flexDirection: 'row'}}>
                <RadioButton value={5} />
                <TextView style={{textAlignVertical: 'center'}} text='Outstanding' />
              </View>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={5}
                starSize={20}
                fullStarColor="red"
                starStyle={{width: 23}}
              />
            </View>
            <View style={styles.radioContainer}>
              <View style={{flexDirection: 'row'}}>
                <RadioButton value={4} />
                <TextView style={{textAlignVertical: 'center'}} text='Good' />
              </View>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={4}
                starSize={20}
                fullStarColor="red"
                starStyle={{width: 23}}
              />
            </View>
            <View style={styles.radioContainer}>
              <View style={{flexDirection: 'row'}}>
                <RadioButton value={3} />
                <TextView style={{textAlignVertical: 'center'}} text='Average' />
              </View>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={3}
                starSize={20}
                fullStarColor="red"
                starStyle={{width: 23}}
              />
            </View>
            <View style={styles.radioContainer}>
              <View style={{flexDirection: 'row'}}>
                <RadioButton value={2} />
                <TextView style={{textAlignVertical: 'center'}} text='Not Good' />
              </View>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={2}
                starSize={20}
                fullStarColor="red"
                starStyle={{width: 23}}
              />
            </View>
            <View style={styles.radioContainer}>
              <View style={{flexDirection: 'row'}}>
                <RadioButton value={1} />
                <TextView style={{textAlignVertical: 'center'}} text='Terrible' />
              </View>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={1}
                starSize={20}
                fullStarColor="red"
                starStyle={{width: 23}}
              />
            </View>
          </RadioButton.Group>
          {/* <KeyboardAvoidingView behavior="padding" style={{ paddingBottom: 500 }}> */}
          <View
            style={{
              height: height - 450,
            }}>
            <View style={{height: '70%', paddingHorizontal: 40}}>
              <TextView style={{color: 'black', fontWeight: '600', fontSize: 20}} text='Review' />
              <TextInput
                style={{
                  // backgroundColor: 'white',
                  height: '80%',
                  textAlignVertical: 'top',
                  fontSize: 16,
                }}
                onChangeText={review => this.setState({review})}
                value={review}
                placeholderTextColor="#bcc5d3"
                multiline
                placeholder={language.promotions.leave_your_feedback(lan)}
                onFocus={this.onFocus}
              />
            </View>
            <TouchableOpacity
              onPress={this.submitRating.bind(this)}
              style={{
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                height: '30%',
              }}>
              <Customon name="check-circle" size={20} color="white" />
              <TextView
                style={{
                  fontWeight: '600',
                  color: '#ffffff',
                  fontSize: 12,
                  marginHorizontal: 20,
                }} text='SUBMIT RATING' />
            </TouchableOpacity>
          </View>
          {/* </KeyboardAvoidingView> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  radioContainer: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalStyle: {
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 50,
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps, {fetchUserProfileReviews})(
  RatingsScreen,
);
