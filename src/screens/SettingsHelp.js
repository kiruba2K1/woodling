import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import { Switch } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fontelloConfig from '../config.json';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

export default class SettingsHelp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerArrow}>
            <TouchableOpacity   onPress={() => this.props.navigation.goBack()}>
              <Customon
                style={styles.arrowback}
                name="long-arrow-left"
                size={15}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerTitle}>
            <TextView style={styles.title} text='Setting > Help' />
          </View>
        </View>

        <View
          style={{
            height: 47,
            backgroundColor: '#ffff',
            padding: 20,
            justifyContent: 'center',
            marginTop: 15,
            borderWidth: 1,
            borderColor: '#eeeeee'
          }}>
          <TextView
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: '#000'
            }} text='Report a Problem' />
        </View>
        <View
          style={{
            height: 47,
            backgroundColor: '#ffff',
            padding: 20,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#eeeeee'
          }}>
          <TextView
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: '#000'
            }} text='Submit Suggestion' />
        </View>
        <TouchableOpacity
        onPress={()=>this.props.navigation.navigate("SettingsFAQ")}
          style={{
            height: 47,
            backgroundColor: '#ffff',
            padding: 20,
            justifyContent: 'center',
            marginTop: 15,
            borderWidth: 1,
            borderColor: '#eeeeee'
          }}>

          <TextView
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: '#000'
            }} text='FAQs' />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee'
  },
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    //  justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
    padding: 15,

    shadowOffset: { width: 3, height: 0 },
    elevation: 5
  },

  title: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  },

  arrowback: {
    color: '#000'
  },

  headerArrow: {
    flex: 1
  },

  headerTitle: {
    flex: 2,
    // marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center'
  }
});
