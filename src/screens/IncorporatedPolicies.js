/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {FAB} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
const Customon = createIconSetFromFontello(fontelloConfig);

export default class IncorporatedPolicies extends Component {
  goToTop = () => {
   this.scroll.scrollTo({x: 0, y: 0, animated: true});
}


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
          <Text style={styles.title}>Incorporated Policies</Text>
        </View>
      </View>
      <ScrollView ref={(c) => {this.scroll = c}}>
      <ImageBackground
        source = {require('../images/red-banner.png')}
        style = {{width: Dimensions.get('window').width, height: 60,backgroundColor: '#fb0201',alignItems: 'flex-end', padding: 20, justifyContent: 'center'}}>
        <View style={{flexDirection:'row', justifyContent: 'center', }}>
        <Text style = {styles.imageText}>Disputes &nbsp;</Text>
        <Text style = {styles.number}>1</Text>
        </View>
       </ImageBackground>

       </ScrollView>

       <FAB
         style={styles.fab}
         icon={() => <Icon name="chevron-down" color="#fb0201" size={25} />}
         onPress={() =>
           this.goToTop()
         }
       />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
  number:{
    color: '#ffffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 40,

  },
  contentText:{
        color: '#000000',
   fontFamily: 'Poppins',
   fontSize: 14,
   fontWeight: '500',
   lineHeight: 21,
   paddingTop: 5,
    },
  imageText:{
    color: '#ffffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 19,
    paddingTop: 17,
    // justifyContent: 'center',
  },
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    //  justifyContent: 'space-between',
    alignItems: 'center',
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
      //flex: 1
      paddingRight:20,
    },

    headerTitle: {
      //flex: 2,
      // marginLeft: 35,
      // alignItems: 'center',
      justifyContent: 'center'
    }
});
