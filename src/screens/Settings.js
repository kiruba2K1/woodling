import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import fontelloConfig from '../config.json';
import {imageurl, apiurl} from '../constants/config.js';
import store from '../redux/store';
import firebase from 'react-native-firebase';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

class Settings extends Component {
  logOut = () => {
    const {user_id, navigation} = this.props;
    // console.log(user_id);
    axios
      .get(`${apiurl}logout.php?user_id=${user_id}`)
      .then(res => {
        if (res.data.status === 'success') {
          AsyncStorage.removeItem('user');
          this.ref = firebase
            .firestore()
            .collection('users')
            .doc(user_id);

          const status = {
            user_status: 'offline',
          };
          this.ref.set(status);
          navigation.navigate('Presetup');
        } else alert('Unable to logout');
      })
      .catch(res => alert('an error occurred please try again'));
  };

  render() {
    const {profilepicture} = this.props;
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={false}
          backgroundColor="white"
          barStyle="dark-content"
        />
        <SafeAreaView>
          <View style={styles.header}>
            <View style={styles.headerArrow}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Customon
                  style={styles.arrowback}
                  name="long-arrow-left"
                  size={15}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.headerTitle}>
              <TextView style={styles.title} text="Settings" />
              <Image
                source={
                  profilepicture === ''
                    ? require('../images/ic_account_circle_24px.jpg')
                    : {uri: `${imageurl}/${profilepicture}`}
                }
                style={{
                  width: 68,
                  height: 68,
                  marginTop: 8,
                  borderRadius: 50,
                  overflow: 'hidden',
                }}
              />
            </View>
          </View>
        </SafeAreaView>
        <ScrollView>
          <View style={styles.greyComponent}>
            <TextView style={styles.greyText} text="Me" />
          </View>
          <TouchableOpacity
            style={styles.activeComponent}
            onPress={() => this.props.navigation.navigate('SettingsProfile')}>
            <TextView style={styles.activeText} text="Profile" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.activeComponent}
            onPress={() => this.props.navigation.navigate('SettingsAccount')}>
            <TextView style={styles.activeText} text="Account" />
          </TouchableOpacity>
          <View style={styles.greyComponent}>
            <TextView style={styles.activeText} text="General" />
          </View>
          <TouchableOpacity
            style={styles.activeComponent}
            onPress={() =>
              this.props.navigation.navigate('SettingsNotifications')
            }>
            <TextView style={styles.activeText} text="Notifications" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.activeComponent}
            onPress={() => this.props.navigation.navigate('SettingsPrivacy')}>
            <TextView style={styles.activeText} text="Privacy" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activeComponent}
            onPress={() => this.props.navigation.navigate('SettingsSharing')}>
            <TextView style={styles.activeText} text="Sharing" />
          </TouchableOpacity>
          <View style={styles.greyComponent}>
            <TextView style={styles.activeText} text="Info & Legal" />
          </View>
          <TouchableOpacity
            style={styles.activeComponent}
            onPress={() => this.props.navigation.navigate('SettingsHelp')}>
            <TextView style={styles.activeText} text="Help" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activeComponentAbout}
            onPress={() => this.props.navigation.navigate('SettingsAbout')}>
            <TextView style={styles.activeText} text="About" />
            <Image
              source={require('../images/Woodlig_logo.png')}
              style={{width: 59, height: 15, marginLeft: 6, marginTop: 4}}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.logOut}>
            <View style={styles.activeComponentLogout}>
              <TextView style={styles.activeText} text="Logout" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  activeComponentLogout: {
    width: Dimensions.get('window').width,
    backgroundColor: '#ffff',
    height: 47,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#eeeeee',
    padding: 10,
    marginBottom: 15,
  },

  activeComponentAbout: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    backgroundColor: '#ffff',
    height: 47,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#eeeeee',
    padding: 10,
  },
  activeComponent: {
    width: Dimensions.get('window').width,
    backgroundColor: '#ffff',
    height: 47,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#eeeeee',
    padding: 10,
  },

  greyComponent: {
    padding: 10,
  },
  greyText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#808080',
  },

  activeText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },

  headerArrow: {
    flex: 2,
  },

  headerTitle: {
    flex: 3,

    justifyContent: 'center',
  },
  header: {
    width: Dimensions.get('window').width,
    height: 159,
    backgroundColor: '#ffff',
    //  justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
    padding: 15,

    shadowOffset: {width: 3, height: 0},
    elevation: 5,
  },

  title: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },

  arrowback: {
    color: '#000',
  },
  imageProfile: {
    width: 68,
    height: 68,
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(Settings);
