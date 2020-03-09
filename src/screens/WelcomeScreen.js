import React, {Component} from 'react';
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import {userId} from '../redux/actions/userId';
import {
  profilePicture,
  getUsername,
  getEmail,
} from '../redux/actions/profilePicture';
import {connect} from 'react-redux';
import TextView from '../components/TextView';

const Icon = createIconSetFromFontello(fontelloConfig);

// eslint-disable-next-line react/prefer-stateless-function
class WelcomeScreen extends Component {
  state = {
    loading: true,
    lan: 'en',
  };

  componentDidMount() {
    this.checkLanguageAvailability();
    this.getUser();
  }

  checkLanguageAvailability() {
    AsyncStorage.getItem('lan', (error, result) => {
      if (!error && result != null) {
        console.log('Successfully get the languageSelected : ', result);
        if (result == 'fr') {
          this.setState({
            lan: 'fr',
          });
        } else {
          this.setState({
            lan: 'en',
          });
        }
      } else {
        console.log('unSuccessfully get the languageSelected');
        this._storeData();
      }
    });
  }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem('lan', 'en');
    } catch (error) {
      console.log('----------- Error');
      console.error(error);
    }
  };

  getUser = () => {
    AsyncStorage.getItem('user', (error, result) => {
      if (!error) {
        var data = JSON.parse(result);
        if (data) {
          this.props.userId(data.id);
          this.props.profilePicture(data.profile_picture);
          this.props.getUsername(data.username);
          this.props.getEmail(data.email);
          this.setState({loading: false});
          this.props.navigation.navigate('Navigator');
        } else {
          this.setState({loading: false});
        }
      } else {
        this.setState({loading: false});
      }
    });
  };

  render() {
    return (
      <ImageBackground source={require('../images/bg.png')} style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', marginHorizontal: 30}}>
          <View style={{flex: 2.5}}>
            <View style={{flex: 1, justifyContent: 'space-evenly'}}>
              <Image source={require('../images/woodlig_brand_white.png')} />
            </View>
            <View style={{flex: 3.5, justifyContent: 'space-around'}}>
              <Image
                source={require('../images/Woodlig_logo.png')}
                style={{marginTop: 50}}
              />
              <View style={{marginTop: -50}}>
                <TextView style={styles.motto} text="The Lig" />
                <TextView style={styles.motto} text="of Stars" />
              </View>
            </View>
          </View>
          {this.state.loading ? (
            <View
              style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator color="red" size={50} />
            </View>
          ) : (
            <View style={{flex: 2, alignItems: 'center'}}>
              <View style={{flex: 2, justifyContent: 'space-around'}}>
                <TouchableOpacity
                  style={styles.buttonStyles}
                  onPress={() => this.props.navigation.navigate('Signup')}>
                  <TextView style={styles.buttonText} text="Create Account" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonStyles}
                  onPress={() => this.props.navigation.navigate('Login')}>
                  <TextView style={styles.buttonText} text="Login" />
                </TouchableOpacity>
              </View>
              <View style={{flex: 2}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.hrStyle} />
                  <TextView
                    style={{
                      color: '#dedede',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}
                    text="OR"
                  />
                  <View style={styles.hrStyle} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {/* <TouchableOpacity>
                    <Image
                      style={styles.iconStyle}
                      source={require('../images/Google_icon.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image
                      style={styles.iconStyle}
                      source={require('../images/Facebook_icon.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image
                      style={styles.iconStyle}
                      source={require('../images/Twitter_icon.png')}
                    />
                  </TouchableOpacity> */}
                </View>
                <View style={{alignItems: 'center'}}>
                  <TextView
                    style={styles.footer}
                    text={` By signing up you agree to our`}
                  />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <TextView
                    style={[styles.footer, {textDecorationLine: 'underline'}]}
                    text="Terms of Service"
                  />
                  <TextView
                    style={[styles.footer, {marginLeft: 5, marginRight: 5}]}
                    text="&"
                  />
                  <TextView
                    style={[styles.footer, {textDecorationLine: 'underline'}]}
                    text="Privacy Policy"
                  />
                </View>
              </View>
              <View />
            </View>
          )}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  motto: {
    color: 'black',
    fontSize: 40,
    fontFamily: 'Forte',
  },
  buttonStyles: {
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: 300,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
  hrStyle: {
    height: 1,
    backgroundColor: '#dedede',
    width: 130,
    alignSelf: 'center',
  },
  footer: {
    color: 'black',
    fontWeight: 'bold',
  },
  iconStyle: {
    height: 54,
    width: 54,
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
})(WelcomeScreen);
