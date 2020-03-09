import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { connect } from 'react-redux';
import { apiurl } from '../constants/config';
import fontelloConfig from '../config.json';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);
const { width, height } = Dimensions.get('window');
class SettingsAccount extends Component {
  state = {
    email: '',
    username: '',
    loading: false,
    accountStatus: [],
  };

  componentDidMount() {
    const { user_id } = this.props;
    axios
      .get(`${apiurl}fetch-user-details.php?user_id=${user_id}`)
      .then(res => {
        console.log(res.data);
        this.setState({
          accountStatus: res.data,
          email: res.data.user_details.email,
          username: res.data.user_details.username,
        });
      })
      .catch(res => console.log(res.data));
  }

  updateEmail = async () => {
    const { user_id } = this.props;
    const { email } = this.state;
    this.setState({ loading: true });
    Keyboard.dismiss();
    await axios
      .get(
        `${apiurl}update-setting-account.php?user_id=${user_id}&type=email&email=${email}`,
      )
      .then(res => {
        console.log(res.data);
        if (res.data.status === 'success') {
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
      })
      .catch(res => alert('Please Try Again'));
    this.setState({ loading: false });
    // }
  };

  updateUsername = async () => {
    const { user_id } = this.props;
    const { username } = this.state;
    this.setState({ loading: true });
    Keyboard.dismiss();
    await axios
      .get(
        `${apiurl}update-setting-account.php?user_id=${user_id}&type=username&username=${username}`,
      )
      .then(res => alert(res.data.message))
      .catch(res => console.log(res.data));
    this.setState({ loading: false });
  };

  render() {
    const { email, username, accountStatus, loading } = this.state;
    if (accountStatus.status === 'success') {
      return (
        <View style={styles.container}>
          <Portal>
            <Modal visible={loading}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="#fb0201" />
              </View>
            </Modal>
          </Portal>
          <StatusBar
            translucent={false}
            backgroundColor="#fff"
            barStyle="dark-content"
          />
          <SafeAreaView>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Customon
                  style={styles.arrowback}
                  name="long-arrow-left"
                  size={15}
                />
              </TouchableOpacity>
              <TextView style={styles.title} text='Setting > Account' />
              <TouchableOpacity>
                <FontAwesome5
                  style={styles.arrowback}
                  name="ellipsis-v"
                  size={15}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          {/* <View style={styles.verify}>
          <View style={{ flex: 3 }}>
            <Text style={styles.verifyText}>
              Your account is not yet verified! We can't secure your data until you do.
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.buttoncontainer}>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: 'Poppins-Medium',
                  color: '#ffffff'
                }}>
                {' '}
                Verify Now{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
          <View style={styles.bodyExperience}>
            <View style={styles.activeComponent}>
              <View style={styles.wrapper}>
                <TextView style={styles.activeText} text='Email' />
                <TextInput
                  ref={ref => {
                    this.FirstInput = ref;
                  }}
                  onChangeText={text => this.setState({ email: text })}
                  value={email}
                  textContentType="emailAddress"
                  autoCompleteType="email"
                  placeholder="hj.productions@hotmail.com"
                  style={[styles.activeText2, { width: width - 120 }]}
                />
              </View>
              <TouchableOpacity
                style={styles.buttoncontainer2}
                onPress={this.updateEmail}>
                <TextView
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                    color: '#000',
                  }} text='Change' />
              </TouchableOpacity>
            </View>

            <View style={styles.activeComponent}>
              <View style={styles.wrapper}>
                <TextView style={styles.activeText} text='Username' />
                {/* <Text style={styles.activeText2}>@UcheTheGoat</Text> */}
                <TextInput
                  ref={ref => {
                    this.usernameInput = ref;
                  }}
                  onChangeText={text => this.setState({ username: text })}
                  value={username}
                  placeholder="@uchethegreat"
                  style={[styles.activeText2, { width: width - 120 }]}
                />
              </View>
              <TouchableOpacity
                style={styles.buttoncontainer2}
                onPress={this.updateUsername}>
                <TextView
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                    color: '#000',
                  }} text='Change' />
              </TouchableOpacity>
            </View>



            <View style={styles.activeComponent}>
              <View style={styles.wrapper}>
                <TextView style={styles.activeText} text='Phone Number' />
                {/* <Text style={styles.activeText2}>@UcheTheGoat</Text> */}
                {/* <TextInput
                  // ref={ref => {
                  //   this.usernameInput = ref;
                  }}
                  // onChangeText={text => this.setState({username: text})}
                  // value={username}
                  // placeholder="@uchethegreat"
                  // style={[styles.activeText2, {width: width - 120}]}
                /> */}
              </View>
              <TouchableOpacity
                style={styles.buttoncontainer2}
              // onPress={this.updateUsername}
              >
                <TextView
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                    color: '#000',
                  }} text='Change' />
              </TouchableOpacity>
            </View>

            <View style={styles.activeComponent}>
              <View style={styles.wrapper}>
                <TextView style={styles.activeText} text='Password' />
                <Text style={styles.activeText2}>********</Text>
              </View>
              <TouchableOpacity
                style={styles.buttoncontainer2}
                onPress={() =>
                  this.props.navigation.navigate('UpdatePassword')
                }>
                <TextView
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                    color: '#000',
                  }} text='Change' />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bodyExperience2}>
            <View style={styles.activeComponent}>
              <Text style={styles.activeText}>Facebook</Text>

              <TouchableOpacity style={styles.buttoncontainer2}>
                <TextView
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                    color: '#000',
                  }} text='Link' />
              </TouchableOpacity>
            </View>

            <View style={styles.activeComponent}>
              <Text style={styles.activeText}>Google</Text>

              <TouchableOpacity style={styles.buttoncontainer3}>
                <TextView
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Medium',
                    color: '#000',
                  }} text='Linked' />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.activeComponent}>
            <Text style={styles.activeText}>Twitter</Text>

            <TouchableOpacity style={styles.buttoncontainer2}>
              <TextView
                style={{
                  fontSize: 13,
                  fontFamily: 'Poppins-Medium',
                  color: '#000',
                }} text='Link' />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return <ActivityIndicator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  bodyExperience: {
    width: Dimensions.get('window').width,
    backgroundColor: '#ffff',
    marginTop: 15,
  },

  bodyExperience2: {
    width: Dimensions.get('window').width,
    backgroundColor: '#ffff',
    marginTop: 15,
  },

  activeComponent: {
    width: Dimensions.get('window').width,

    height: 78,
    borderColor: '#eeeeee',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  activeText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },
  activeText2: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#808080',
  },

  verifyText: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    // width: 195,
    // flexWrap: 'wrap',
  },

  buttoncontainer2: {
    width: 80,
    height: 25,
    borderRadius: 25,
    borderColor: '#d1d1d1',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#dedede',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttoncontainer3: {
    width: 80,
    height: 25,
    borderRadius: 25,
    borderColor: '#0ce0b5',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#dedede',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttoncontainer: {
    width: 71,
    height: 24,
    backgroundColor: '#fb0201',
    shadowRadius: 2,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
  },

  buttontext: {
    color: '#ffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },

  verify: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    marginTop: 15,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: '#ffff',
    padding: 10,
  },
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: { width: 3, height: 0 },
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
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(SettingsAccount);
