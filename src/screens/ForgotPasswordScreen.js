import React, { Component } from 'react';
import {
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { apiurl } from '../constants/config';
import fontelloConfig from '../config.json';
import { createIconSetFromFontello } from 'react-native-vector-icons';
const Customon = createIconSetFromFontello(fontelloConfig);
const { height, width } = Dimensions.get('window');
const textColor = 'black';
import TextView from '../components/TextView';
// eslint-disable-next-line react/prefer-stateless-function
export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#eeeeee',
      field: '',
      type: 'email',
      loading: false,
      data: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidUpdate() {
  //   if(this.state.data.status)
  // }

  async handleSubmit() {
    this.setState({ loading: true });
    const { field, type } = this.state;
    const data = { field, type };
    await axios
      .post(`${apiurl}forgot-password`, data)
      .then(res => {
        try {
          if (res.data.status === 'error') throw res.data.message;
          else if (res.data.status === 'success') {
            this.props.navigation.navigate('TabbedAccounts', {
              itemId: 0
            });
          } else {
            throw 'please try again';
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
            textColor: 'white'
          });
        }
      })
      .catch(res => console.log(res.data));
    this.setState({ loading: false });
  }

  render() {
    const { color, loading } = this.state;
    return (
      <ScrollView contentContainerStyle={{ height, width }}>
        <StatusBar backgroundColor={color} barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: color }}>
          <View style={{ flex: 3 }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                marginLeft: 20,
                marginTop: '5%'
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Customon
                name="long-arrow-left"
                size={15}
                color={textColor}
              />
            </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 6,
                justifyContent: 'flex-start',
                marginTop: '15%',
                marginHorizontal: 20
              }}>
              <View style={{ height: '80%' }}>
                <View style={{ flex: 1 }}>
                  <TextView
                    style={{
                      fontSize: 40,
                      fontWeight: '100',
                      color: textColor,
                      textAlign: 'center'
                    }}
                    numberOfLines={1} text='Forgot password' />
                </View>
                <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 20 }}>
                  <TextView style={{ color: textColor, fontSize: 15 }} text='Enter your email address or phone number, and we will send you new login details.' />

                </View>
                <View style={{ flex: 1, marginHorizontal: 20 }}>
                  <TextView style={{ color: textColor }} text='EMAIL ADDRESS OR PHONE NUMBER' />
                  <TextInput
                    style={{ borderBottomWidth: 1, borderBottomColor: '#dedede' }}
                    placeholder="example@test.com | 555-555-5555"
                    placeholderTextColor={textColor}
                    onChangeText={field => this.setState({ field })}
                  />
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  {!loading ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#8a8a8a',
                        width: 150,
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderRadius: 30
                      }}
                      onPress={this.handleSubmit}>
                      <TextView
                        style={{
                          color: textColor,
                          fontSize: 20,
                          textAlign: 'center'
                        }} text='SEND' />
                      
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#8a8a8a',
                        width: 150,
                        paddingTop: 10,
                        paddingBottom: 10,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                      <Progress.CircleSnail
                        color="white"
                        size={20}
                        indeterminate
                        indeterminateAnimationDuration={4000}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
