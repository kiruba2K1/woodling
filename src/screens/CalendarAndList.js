/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  FlatList,
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {createIconSetFromFontello} from 'react-native-vector-icons';
const Customon = createIconSetFromFontello(fontelloConfig);
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fontelloConfig from '../config.json';
import ViewCastingCalls from '../components/ViewCastingCalls';
const moment = require('moment');
import TextView from '../components/TextView';

export default class CalendarAndList extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const castingDetails = navigation.getParam('castingDetails', 'NO-ID');
    const date = navigation.getParam('date', 'NO-ID');

    var t = moment(date, 'DD MMM YYYY');
    var day = moment(t).format('DD');
    var month = moment(t).format('MMMM');
    var year = moment(t).format('YYYY');

    console.log(
      '-------------- User Clicked casingDetails Data Received --------------',
    );
    console.log(castingDetails);
    console.log(date);

    this.state = {
      castingCalls: castingDetails,
      day: day,
      month: month,
      year: year,
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerArrow}>
            <TouchableOpacity>
              <Customon
                style={styles.arrowback}
                name="long-arrow-left"
                size={15}
                onPress={() => this.props.navigation.goBack()}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerTitle}>
            <TextView style={styles.title} text="Casting Calls" />
          </View>
        </View>
        <View style={styles.containerView}>
          <View style={styles.banner}>
            <View style={styles.calendarView}>
              <View
                style={{
                  paddingTop: 8,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingBottom: 7,
                  flexDirection: 'row',
                }}>
                <View style={{flex: 1, padding: 10}}>
                  <Text
                    style={{
                      fontSize: 30,
                      fontFamily: 'Poppins-Medium',
                      color: '#fff',
                    }}>
                    {this.state.day}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Poppins-Medium',
                      color: '#fff',
                    }}>
                    {this.state.month}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Poppins-Medium',
                      color: '#fff',
                    }}>
                    {this.state.year}
                  </Text>
                </View>
                <View style={{paddingTop: 5, paddingRight: 6}}>
                  <Customon
                    style={styles.arrowback}
                    name="calendar-star"
                    size={21}
                    color="white"
                  />
                </View>
              </View>
            </View>
            <View style={styles.filter}>
              <TextView
                style={{
                  fontSize: 15,
                  fontFamily: 'Poppins-Medium',
                  color: '#3e3e3e',
                }}
                text={`Filters{' '}`}></TextView>
            </View>
          </View>
          <View style={styles.scroll}>
            {
              <View style={{backgroundColor: '#eeeeee'}}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.castingCalls}
                  removeClippedSubviews
                  contentContainerStyle={{marginTop: 10}}
                  // refreshing={this.state.isFetching}
                  // onRefresh={this.onRefresh}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <ViewCastingCalls
                      title={item.title}
                      roles_count={item.roles_count}
                      production_type={item.production_type}
                      formatted_address={item.formatted_address}
                      description={item.description}
                      skill={item.skill}
                      active={item.active}
                      postid={0}
                      created_by={item.created_by}
                    />
                  )}
                />
              </View>
            }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 2,
    padding: 10,
  },
  containerView: {
    padding: 10,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filter: {
    width: Dimensions.get('window').width,
    height: 46,
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 6,
    backgroundColor: '#ffffff',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    //flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarView: {
    width: 141,
    height: 118,
    borderRadius: 30,
    backgroundColor: '#fb0201',
    marginBottom: 10,
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

  arrowRight: {
    color: '#fb0201',
    marginLeft: 10,
  },

  headerArrow: {
    flex: 1,
  },

  headerTitle: {
    flex: 2,
    //marginLeft: 35,
    //alignItems: 'center',
    justifyContent: 'center',
  },
});
