/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Picker,
  ImageBackground,
  Image,
} from 'react-native';

import {Dropdown} from 'react-native-material-dropdown';
import RangeSlider from 'rn-range-slider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import StarRating from 'react-native-star-rating';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {List, Checkbox, RadioButton} from 'react-native-paper';
import {connect} from 'react-redux';
import fontelloConfig from '../config.json';
import HeaderComponent from '../components/HeaderComponent';
import WalletPromotion from '../components/WalletPromotion';
import {fetchProductionType} from '../redux/actions/fetchProductionType';
import {rolesType, rolesAction} from '../redux/actions/rolesAction';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);
const {width, height} = Dimensions.get('window');

const lan = global.MyVar;
import language from "../constants/language.js"

export default class CastingCallFilter extends Component {
  state = {
      checked: 'first',
    };

  render() {
     const { checked } = this.state;
     let data = [{
      value: 'Banana',
    }, {
      value: 'Mango',
    }, {
      value: 'Pear',
    }];
    return (
      <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Customon style={styles.arrowback} name="x" size={12} />
          </TouchableOpacity>
          <TextView style={styles.title} text='Filter Casting Calls' />
          <TouchableOpacity
            onPress={() => {
              console.warn(filters);
              // this.props.navigation.push('CastingCallsScreen', {filters})
            }}>
            <Customon style={styles.arrowback2} name="check" size={20} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView>
      <View style={{paddingLeft: 10, marginTop: 8}}>
        <TextView
          style={{
            color: '#808080',
            fontSize: 15,
            fontFamily: 'Poppins-Medium',
          }} text='Location' />


      </View>
      <View style={styles.searchContainer}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.searchCurve}>
          <TextInput
            style={styles.search}
            placeholder={language.promotions.type_location_here(lan)}
            // value={location}
            // onChangeText={location => this.setState({location})}
          />
          <Customon name="search" size={15} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Customon
            style={{marginRight: 4}}
            name="map-marker-alt"
            size={12}
            color="red"
          />
          <TextView
            style={{
              fontSize: 9,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }} text='Worldwide'/>

        </View>
      </View>
      </View>

      <View style={{paddingLeft: 10, marginTop: 8}}>
        <TextView
          style={{
            color: '#808080',
            fontSize: 15,
            fontFamily: 'Poppins-Medium',
          }} text='Age Range' />
      </View>

        <View style={styles.searchContainer}>

          <View style={styles.range}>
        <RangeSlider
        style={{width: 300, height: 80}}
        // gravity={'center'}
        min={0}
        max={100}
        step={1}
        selectionColor="#3df"
        blankColor="#f618" />
        </View>
        </View>
        <View style={{paddingLeft: 10, marginTop: 8}}>
          <TextView
            style={{
              color: '#808080',
              fontSize: 15,
              fontFamily: 'Poppins-Medium',
            }} text='Production Type' />

        </View>
        <View style={styles.searchContainer}>

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
        <RadioButton
          value="first"
          status={checked === 'first' ? 'checked' : 'unchecked'}
          onPress={() => { this.setState({ checked: 'first' }); }}
        />
        <TextView
        style={{
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
          color: '#000',
        }} text='Select all' />

        </View>
          <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <RadioButton
            value="first"
            status={checked === 'first' ? 'checked' : 'unchecked'}
            onPress={() => { this.setState({ checked: 'first' }); }}
          />
        <Dropdown containerStyle={{width: 150, marginTop: -24}}
       label='Favorite Fruit'
       data={data}
     />
        </View>
        </View>
        </View>

        <View style={{paddingLeft: 10, marginTop: 8}}>
          <TextView
            style={{
              color: '#808080',
              fontSize: 15,
              fontFamily: 'Poppins-Medium',
            }} text='Production Type' />

        </View>
        <View style={styles.searchContainer}>

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
        <RadioButton
          value="first"
          status={checked === 'first' ? 'checked' : 'unchecked'}
          onPress={() => { this.setState({ checked: 'first' }); }}
        />
        <TextView
        style={{
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
          color: '#000',
        }} text='Select all' />
        </View>
          <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <RadioButton
            value="first"
            status={checked === 'first' ? 'checked' : 'unchecked'}
            onPress={() => { this.setState({ checked: 'first' }); }}
          />
        <Dropdown containerStyle={{width: 150, marginTop: -24}}
       label='Favorite Fruit'
       data={data}
     />
        </View>
        </View>
        </View>

        <View style={{paddingLeft: 10, marginTop: 8}}>
          <TextView
            style={{
              color: '#808080',
              fontSize: 15,
              fontFamily: 'Poppins-Medium',
            }} text='Role Type' />

        </View>
        <View style={styles.searchContainer}>

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
        <RadioButton
          value="first"
          status={checked === 'first' ? 'checked' : 'unchecked'}
          onPress={() => { this.setState({ checked: 'first' }); }}
        />
        <TextView
        style={{
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
          color: '#000',
        }} text='Role' />

        </View>
          <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <RadioButton
            value="first"
            status={checked === 'first' ? 'checked' : 'unchecked'}
            onPress={() => { this.setState({ checked: 'first' }); }}
          />
        <Dropdown containerStyle={{width: 150, marginTop: -24}}
       label='Favorite Fruit'
       data={data}
     />
        </View>
        </View>
        </View>

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
  range: {
    width: Dimensions.get('window').width,
    backgroundColor: '#ffff',
    // padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  text: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  search: {
    width: 240,
    padding: 0,
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#bfbfbf',
  },
  searchCurve: {
    alignItems: 'center',
    width: 284,
    height: 29,
    marginBottom: 15,
    paddingLeft: 15,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {width: 3, height: 0},
    // shadowRadius: 6,
    // borderRadius: 30,
    borderColor: '#dedede',
    borderStyle: 'solid',
    borderWidth: 0.5,
    flexDirection: 'row',
  },
  searchContainer: {
    // justifyContent: 'center',
    // alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: '#ffff',
    padding: 15,
    // height: 164,
    marginTop: 1,
  },

  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  headerArrow: {
    flex: 1,
  },

  headerTitle: {
    flex: 2,
    marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center',
  },
});
