import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {createStackNavigator, SafeAreaView} from 'react-navigation';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import WelcomeScreen from '../screens/WelcomeScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SetupTabBar from './SetupTabBar';
import fontelloConfig from '../config.json';

const Customon = createIconSetFromFontello(fontelloConfig);

const Presetup = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      navigationOptions: {
        header: null,
      },
    },
    SetupTopTabBar: {
      screen: SetupTabBar,
      navigationOptions: {
        header: ({navigation}) => (
          <View style={{overflow: 'hidden', backgroundColor: '#ffffff'}}>
            <SafeAreaView>
              <View style={{height: 80}}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 30,
                    // zIndex: 999999,
                    left: 15,
                  }}
                  onPress={() => navigation.goBack(null)}>
                  <Customon name="long-arrow-left" color="black" size={15} />
                </TouchableOpacity>
                {/* <View
                  style={{
                    height: 200,
                    width: 200,
                    // backgroundColor: 'green',
                    alignSelf: 'flex-end',
                  }}>
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: 'blue',
                    }}
                    resizeMode="contain"
                    source={require('../images/LoginRegisterMask.png')}
                  />
                </View> */}
              </View>
            </SafeAreaView>
            <View style={{bottom: 30}}>
              <Image
                resizeMode="contain"
                style={{alignSelf: 'center', height: 50, width: 150}}
                source={require('../images/Woodlig_new_logo.png')}
              />
            </View>
          </View>
        ),
      },
    },
  },
  {
    initialRouteName: 'Welcome',
  },
);

export default Presetup;
