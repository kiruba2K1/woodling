import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import { TextInput, Modal, Portal, ActivityIndicator } from 'react-native-paper';
import { TouchableHighlight } from 'react-native-gesture-handler';
import axios from 'axios';
import { connect } from 'react-redux';
import { apiurl } from '../constants/config';
import TextView from '../components/TextView';

class UpdatePasswordScreen extends Component {
  state = {
    current_password: '',
    new_password: '',
    retype_password: ''
  };

  onSubmit = async () => {
    const user_id = this.props;
    const type = 'password';
    const { current_password, new_password, retype_password } = this.state;
    const details = { type, user_id, current_password, new_password, retype_password };
    console.log(details);
    this.setState({ visible: true });
    await axios
      .post(`${apiurl}update-setting-account.php`, details)
      .then(res => {
        console.log(res.data);
        if (res.data.status === 'success') {
          alert(res.data.message);
          this.props.navigation.goBack();
        } else {
          alert(res.data.message);
        }
      })
      .catch(res => alert('unable to post'));
    this.setState({ visible: false });
  };

  render() {
    const { current_password, new_password, retype_password, visible } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Portal>
          <Modal visible={visible}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#fb0201" />
            </View>
          </Modal>
        </Portal>
        <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" />
        <View style={{ width: '80%', alignSelf: 'center' }}>
          <View style={{ marginBottom: 30 }}>
            <TextInput
              mode="flat"
              label="Old Password"
              value={current_password}
              theme={{
                colors: {
                  background: 'transparent',
                  primary: 'black'
                }
              }}
              textContentType="password"
              secureTextEntry
              onChangeText={current_password => this.setState({ current_password })}
            />
          </View>
          <View style={{ marginBottom: 30 }}>
            <TextInput
              mode="flat"
              label="New Password"
              value={new_password}
              theme={{
                colors: {
                  background: 'transparent',
                  primary: 'black'
                }
              }}
              error={new_password !== retype_password}
              textContentType="password"
              secureTextEntry
              onChangeText={new_password => this.setState({ new_password })}
            />
          </View>
          <View style={{ marginBottom: 30 }}>
            <TextInput
              mode="flat"
              label="Confirm Password"
              error={new_password !== retype_password}
              value={retype_password}
              theme={{
                colors: {
                  background: 'transparent',
                  primary: 'black'
                }
              }}
              textContentType="password"
              secureTextEntry
              onChangeText={retype_password => this.setState({ retype_password })}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <TouchableHighlight style={styles.buttonStyle} onPress={this.onSubmit}>
              <TextView style={styles.saveChanges} text='Save Changes' />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    width: 203,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 6,
    borderRadius: 25,
    backgroundColor: '#fb0201'
  },
  saveChanges: {
    width: 104,
    height: 20,
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.64
  }
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture
});

export default connect(mapStateToProps)(UpdatePasswordScreen);
