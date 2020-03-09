/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fontelloConfig from '../config.json';
const Customon = createIconSetFromFontello(fontelloConfig);
import TextView from '../components/TextView';

export default class Reported extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  goBack = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'TabNavigator'})],
    });
    this.props.navigation.dispatch(resetAction);
  };
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.goBack}>
              <FontAwesome5
                style={styles.arrowback}
                name="chevron-left"
                size={15}
              />
            </TouchableOpacity>

            <View style={{paddingLeft: 20}}>
              <TextView style={styles.title} text='Report Submitted!' />
            </View>
          </View>
        </SafeAreaView>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 20,
            paddingTop: 10,
          }}>
          <Image
            source={require('../images/reported.png')}
            style={{height: 198, width: 296}}></Image>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 15,
            }}>
            <TextView style={styles.thanksText} text='Thank you for helping us keep WoodligTM clean.' />
          </View>
        </View>
        <View
          style={{borderTopColor: '#dedede', borderTopWidth: 0.6, padding: 50}}>
          <TextView style={styles.rules} text="We'll take appropriate action once a breach in WoodligTM Rules & Regulations is verified." />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={styles.backBtn} onPress={this.goBack}>
            <TextView
              style={{
                fontFamily: 'Poppins-Medium',
                color: '#ffffff',
                fontSize: 16,
              }} text='Go Back' />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backBtn: {
    width: 92,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    borderRadius: 6,
    backgroundColor: '#fb0201',
    elevation: 5,
  },
  thanksText: {
    color: '#fb0201',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },

  rules: {
    color: '#1c1c1c',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  header: {
    width: Dimensions.get('window').width,
    height: 100,
    marginBottom: 10,
    backgroundColor: '#ffff',
    //justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: {width: 3, height: 0},
    elevation: 5,
  },
  title: {
    color: '#1c1c1c',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
});
