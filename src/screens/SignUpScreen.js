import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import {TextInput, HelperText} from 'react-native-paper';
import {connect} from 'react-redux';
import axios from 'axios';
import {withNavigation} from 'react-navigation';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-root-toast';
import {ScrollView} from 'react-native-gesture-handler';
import {registerUser} from '../redux/actions/registerActions';
import {apiurl, localurl} from '../constants/config';
import db, {firebase} from '../utils/config';
import {userId} from '../redux/actions/userId';
import TextView from '../components/TextView';
import language from '../constants/language.js';

const {width, height} = Dimensions.get('window');
// eslint-disable-next-line react/prefer-stateless-function
export class SignUp extends Component {
  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      username: '',
      field: '',
      password: '',
      password2: '',
      type: '',
      loading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.fieldType = this.fieldType.bind(this);
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

  RememberMe = data => {
    AsyncStorage.setItem('user', JSON.stringify(data));
  };

  async onSubmit() {
    // this.props.navigation.navigate('SetupScreen');
    const {username, field, password, password2, type} = this.state;
    const register = {
      username,
      field,
      password,
      password2,
      type,
    };
    try {
      if (
        username === '' ||
        field === '' ||
        password === '' ||
        password2 === ''
      )
        throw 'You have an empty field';
      else {
        // this.props.registerUser(register);
        this.setState({loading: true});
        await axios.post(`${apiurl}register.php`, register).then(res => {
          console.log('------------------- Data -------------------');
          console.log(res.data);
          try {
            if (res.data.status === 'error') {
              throw res.data.message;
            } else if (res.data.status === 'success') {
              this.setState({loading: false});
              this.RememberMe(res.data);
              this.props.userId(res.data.id);
              this.props.navigation.navigate('SetupScreen');
            } else {
              throw 'please try again';
            }
          } catch (err) {
            Toast.show(err, {
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
      }
    } catch (error) {
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
    // this.props.navigation.navigate('SetupScreen');
  }

  fieldType(e) {
    const {field} = this.state;
    this.setState({field: e});
    if (isNaN(e)) {
      this.setState({type: 'email'});
    } else {
      this.setState({type: 'phone'});
    }
  }

  render() {
    const {username, field, password, password2, loading, lan} = this.state;
    return (
      <ScrollView contentContainerStyle={{height: height - 180}}>
        <View style={{flex: 1, backgroundColor: '#eeeeee'}}>
          <View style={{flex: 10, justifyContent: 'space-around'}}>
            <TextInput
              placeholder={language.promotions.username(lan)}
              label={language.promotions.username(lan)}
              value={username}
              onChangeText={username => this.setState({username})}
              style={[styles.textInput, {marginTop: 30}]}
            />
            <TextInput
              onChangeText={this.fieldType}
              placeholder={language.promotions.email_or_phone(lan)}
              value={field}
              style={[styles.textInput]}
            />
            <TextInput
              onChangeText={password => this.setState({password})}
              placeholder={language.promotions.password(lan)}
              value={password}
              style={[styles.textInput]}
              secureTextEntry
              textContentType="password"
            />
            <TextInput
              onChangeText={password2 => this.setState({password2})}
              placeholder={language.promotions.confirm_password(lan)}
              value={password2}
              style={[styles.textInput]}
              secureTextEntry
              textContentType="password"
            />
            <HelperText
              style={{marginLeft: '20%'}}
              type="error"
              visible={password !== password2}>
              passwords do not match
            </HelperText>
            <View style={{alignItems: 'center'}}>
              {!loading ? (
                <TouchableOpacity style={styles.button} onPress={this.onSubmit}>
                  <TextView style={styles.buttonText} text="SIGN UP" />
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
              <View style={styles.hrStyle} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '60%',
                alignSelf: 'center',
                paddingVertical: 10,
              }}>
              {/* <TouchableOpacity>
                <Image
                  style={styles.linkStyles}
                  source={require('../images/Google_icon.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={styles.linkStyles}
                  source={require('../images/Facebook_icon.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={styles.linkStyles}
                  source={require('../images/Twitter_icon.png')}
                />
              </TouchableOpacity> */}
            </View>
          </View>
          {/* <View style={{ flex: 1 }}></View> */}
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
    marginTop: 10,
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
    marginTop: 16,
  },
  linkStyles: {
    height: 40,
    width: 40,
  },
});

const mapStateToProps = state => ({
  signup: state.register.values,
});

export default connect(mapStateToProps, {registerUser, userId})(
  withNavigation(SignUp),
);
