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
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {createIconSetFromFontello} from 'react-native-vector-icons';
const Customon = createIconSetFromFontello(fontelloConfig);
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fontelloConfig from '../config.json';

export default class CalendarView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Calendar
          // Specify style for calendar container element. Default = {}

          style={{
            //  borderWidth: 1,
            //borderColor: 'gray',
            height: 350,
          }}
          // Specify theme properties to override specific styles for calendar parts. Default = {}
          theme={{
            backgroundColor: 'gray',
            calendarBackground: 'gray',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#fb0201',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: '#ffff',
            monthTextColor: '#ffff',
            indicatorColor: 'blue',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />

        <View
          style={{
            borderColor: '#ecf0f1',
            borderWidth: 1,
            height: 35,
            width: Dimensions.get('window').width,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text> 20 Aug 2019</Text>
        </View>
        <View style={{alignItems: 'center', height: 55}}>
          <View
            style={{
              width: 28,
              height: 45,
              shadowColor: 'rgba(0, 0, 0, 0.16)',
              shadowOffset: {width: 3, height: 0},
              shadowRadius: 6,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
              elevation: 5,
              backgroundColor: '#f48282',
            }}></View>
        </View>
        <View style={{alignItems: 'center', height: 55}}>
          <Text
            style={{
              color: '#707070',
              fontFamily: 'Poppins-Medium',
              fontSize: 11,
            }}>
            No Casting calls are starting on this day
          </Text>
        </View>

        <ImageBackground
          source={require('../images/graph-line.png')}
          style={{width: Dimensions.get('window').width, height: 100}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
            }}>
            <View
              style={{
                width: 161,
                height: 24,
                borderRadius: 52,
                borderColor: '#fb0201',
                borderStyle: 'solid',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                backgroundColor: '#eeeeee',
              }}>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: 'Poppins-Medium',
                  color: '#fb0201',
                }}>
                Click here to view them
              </Text>
              <Customon
                style={styles.arrowRight}
                name="long-arrow-right"
                size={10}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
    paddingBottom: 10,
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
    marginLeft: 35,
    //alignItems: 'center',
    justifyContent: 'center',
  },
});
