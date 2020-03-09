import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as Progress from 'react-native-progress';
import {withNavigation} from 'react-navigation';
import axios from 'axios';
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  NativeModules,
  Platform,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import Toast from 'react-native-root-toast';
import {ScrollView} from 'react-native-gesture-handler';
// import {firebase} from '../utils/config';
import {loginAuth} from '../redux/actions/loginAuth';
import {apiurl, localurl} from '../constants/config';
import {userId} from '../redux/actions/userId';
import firebase from 'react-native-firebase';
import type, {
  User,
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import {
  profilePicture,
  getUsername,
  getEmail,
} from '../redux/actions/profilePicture';
import TextView from '../components/TextView';

import language from '../constants/language.js';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from 'react-native-google-signin';

import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
const {RNTwitterSignIn} = NativeModules;

const {width, height} = Dimensions.get('window');
const Constants = {
  TWITTER_COMSUMER_KEY: '7IucXYr1rXS0KEh0or42nx9RI ',
  TWITTER_CONSUMER_SECRET: 'ydU4ZIr035w1OMqqPDzbai7OlUVxeu2YZZNoqNF7aG46Rjohqg',
};
// eslint-disable-next-line react/prefer-stateless-function
//184301478703-20g6p2r3nsvglm8tbhddld4gtnv1s1pq.apps.googleusercontent.com
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      field: '',
      password: '',
      type: 'email',
      loading: false,
      lan: 'en',
      fcmToken: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.fieldDetail = this.fieldDetail.bind(this);
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      const token = await AsyncStorage.getItem('fcmToken');

      if (token !== null) {
        console.log('Token in LoginPage ', token);
        this.setState({token});
      } else {
        console.log('Else exicute : ', value);
      }

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
        console.log('Else exicute 1: ', value);
      }
    } catch (error) {
      //alert("error");
      console.log('--------- Error', error);
      // Error retrieving data
    }
  };

  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '184301478703-rjaebkcsigb1q5q6vspujqiu6tc3kreq.apps.googleusercontent.com',
      // '184301478703-40cfnobgn0mtsgvl62o333jb5deuca9f.apps.googleusercontent.com',
      offlineAccess: false,
    });
    RNTwitterSignIn.init(
      Constants.TWITTER_COMSUMER_KEY,
      Constants.TWITTER_CONSUMER_SECRET,
    );
  }

  RememberMe = data => {
    AsyncStorage.setItem('user', JSON.stringify(data));
  };

  async onSubmit() {
    const {field, password, type, token} = this.state;
    const token_type = Platform.OS === 'android' ? 'android' : 'ios';
    const details = {field, password, type, token, token_type};
    console.log('Login request Data : ', details);
    try {
      if (password.length < 6) {
        throw 'password is too short';
      } else {
        this.setState({loading: true});
        await axios
          .post(`${apiurl}login.php`, details)
          .then(res => {
            console.log('------------------- Data -------------------');
            console.log(res.data);
            this.setState({loading: false});
            if (res.data.status === 'error') {
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
            } else if (res.data.status === 'success') {
              //alert(res.data.id);
              this.ref = firebase
                .firestore()
                .collection('users')
                .doc(res.data.id);
              // .get()
              // .then(result=>{
              //   console.log(JSON.stringify(result._data));
              // });

              const status = {
                user_status: 'online',
              };
              this.ref.set(status);

              this.props.userId(res.data.id);
              this.props.profilePicture(res.data.profile_picture);
              this.props.getUsername(res.data.username);
              this.props.getEmail(res.data.email);
              this.RememberMe(res.data);
              this.setState({loading: false});
              this.props.navigation.navigate('Navigator');
            } else {
              this.setState({loading: false});
              Toast.show('please try again', {
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
          })
          .catch(err => {
            this.setState({loading: false});
            alert(err);
            Toast.show('Network error', {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
              backgroundColor: 'red',
              textColor: 'white',
            });
          });
        // this.props.loginAuth(details);
      }
      // end else
    } catch (error) {
      console.log(error);
      Toast.show(error, {
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
    // console.log(details)
  }

  fieldDetail(e) {
    const {field} = this.state;
    this.setState({field: e});
    if (field.includes('@')) {
      this.setState({type: 'email'});
    } else if (field.includes('@') === false) {
      this.setState({type: 'username'});
    }
  }

  GoogleSignin = async () => {
    GoogleSignin.signIn()
      .then(User => {
        this.SignUp(
          User.user.name,
          User.user.name,
          User.user.email,
          'google',
          User.accessToken,
          '',
        );
      })
      .catch(error => {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        } else if (error.code === statusCodes.IN_PROGRESS) {
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Toast.show(
            'Google play service are not install please install it to Sign in with google',
            {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
              backgroundColor: 'red',
              textColor: 'white',
            },
          );
        } else {
          Toast.show(error + '', {
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
      });
  };

  _responseInfoCallback = async (error: ?Object, result: ?Object) => {
    if (error) {
      Toast.show(error.toString(), {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: 'red',
        textColor: 'white',
      });
    } else {
      if (result.hasOwnProperty('email')) {
        const token = await AccessToken.getCurrentAccessToken();
        this.SignUp(
          result.name,
          result.name,
          result.email,
          'Facebook',
          token.accessToken,
          '',
        );
      } else {
        Toast.show('You dont have an email in your facebook account', {
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
    }
  };

  facebookSignin = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(result => {
        if (result.isCancelled) {
        } else {
          this.setState({loading: true});
          const Request = new GraphRequest(
            '/me',
            {
              httpMethod: 'GET',
              version: 'v2.5',
              parameters: {
                fields: {
                  string: 'name,email,picture.type(large)',
                },
              },
            },
            this._responseInfoCallback,
          );
          new GraphRequestManager().addRequest(Request).start();
        }
      })
      .catch(rejected => {
        console.warn('' + rejected.toString());
      });
  };

  twitterSignin = () => {
    RNTwitterSignIn.logIn()
      .then(loginData => {
        console.warn(loginData);
        const {authToken, email, userName} = loginData;
        var username = userName;
        var name = 'no name';
        this.SignUp(username, name, email, 'twitter', authToken, '');
      })
      .catch(error => {
        Toast.show(error.toString(), {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        });
      });
  };

  SignUp = (username, fullname, email, social_media_type, token, phone) => {
    const register = `username=${username}&full_name=${fullname}&email=${email}&social_media_type=${social_media_type}&token=${token}&phone=${phone}`;
    this.setState({loading: true});
    axios.get(`${apiurl}social-media-login.php?${register}`).then(res => {
      this.setState({loading: false});
      if (res.data.status === 'error') {
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
      } else if (res.data.status === 'success') {
        // console.warn(res.data.user_details)
        this.props.userId(res.data.user_details.id);
        this.props.profilePicture(res.data.user_details.profile_picture);
        this.props.getUsername(res.data.user_details.username);
        this.props.getEmail(res.data.user_details.email);
        const data = res.data.user_details;
        this.RememberMe(data);
        this.props.navigation.navigate('Navigator');
      } else {
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
        this.setState({loading: false});
      }
    });
  };

  render() {
    const {field, loading, lan} = this.state;
    return (
      <ScrollView contentContainerStyle={{height: height - 180}}>
        <View style={{flex: 1, backgroundColor: '#eeeeee'}}>
          <View style={{flex: 10, justifyContent: 'space-around'}}>
            <TextInput
              placeholder={language.promotions.email_username(lan)}
              label={language.promotions.email_username(lan)}
              value={field}
              onChangeText={this.fieldDetail}
              style={[styles.textInput, {marginTop: 40}]}
            />
            <TextInput
              onChangeText={password => this.setState({password})}
              placeholder={language.promotions.password(lan)}
              label={language.promotions.password(lan)}
              value={this.state.password}
              secureTextEntry
              textContentType="password"
              style={[styles.textInput]}
            />
            <View style={{alignItems: 'center'}}>
              {!loading ? (
                <TouchableOpacity style={styles.button} onPress={this.onSubmit}>
                  <TextView style={styles.buttonText} text="LOGIN" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity activeOpacity={1} style={styles.button}>
                  <Progress.CircleSnail
                    color="white"
                    size={20}
                    indeterminate
                    indeterminateAnimationDuration={4000}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={{justifyContent: 'space-between'}}>
              <TextView
                onPress={() => this.props.navigation.navigate('ForgotPassword')}
                style={{
                  color: 'red',
                  fontSize: 15,
                  marginLeft: '10%',
                  paddingBottom: 30,
                }}
                text="Forgot Password?"
              />
              <View style={styles.hrStyle} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '60%',
                alignSelf: 'center',
              }}>
              <TouchableOpacity onPress={this.GoogleSignin}>
                <Image
                  style={styles.linkStyles}
                  source={require('../images/Google_icon.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.facebookSignin}>
                <Image
                  style={styles.linkStyles}
                  source={require('../images/Facebook_icon.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.twitterSignin}>
                <Image
                  style={styles.linkStyles}
                  source={require('../images/Twitter_icon.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    width: '80%',
    height: 52,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    shadowColor: 'red',
  },
  button: {
    width: '80%',
    height: 52,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  hrStyle: {
    height: 1,
    width: '80%',
    backgroundColor: '#dedede',
    alignSelf: 'center',
  },
  linkStyles: {
    height: 40,
    width: 40,
  },
});

const mapStateToProps = state => ({
  signin: state.login.response,
});

export default connect(mapStateToProps, {
  userId,
  profilePicture,
  getUsername,
  getEmail,
})(LoginScreen);
