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
const moment = require('moment');
import {apiurl, localurl} from '../constants/config';
import {connect} from 'react-redux';
import {rolesAction} from '../redux/actions/rolesAction';
import {submitcastingcalls} from '../redux/actions/postajob';
import {withNavigation} from 'react-navigation';
import TextView from '../components/TextView';

class NoCastingCalls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectDay: '',
      markedDates: {},
      callCount: 0,
      data: '',
      currentData: [],
    };
    this.getCallDetails();
  }

  selectDay(day) {
    var d = moment(day.dateString).format('DD MMM YYYY');
    var search = moment(day.dateString).format('YYYY-MM-DD');
    // var obj = this.state.markedDates;

    var callCount = 0;
    if (this.state.markedDates[search] != undefined) {
      var data = this.state.markedDates[search];
      callCount = data.data.count;
      console.log('Call count : ' + callCount);
      //this.props.navigation.navigate('CalendarAndList',{castingDetails:data.data.data});
      this.setState({currentData: data.data.data});
    }
    // obj[search] =  {selected: true,marked: true, dotColor: "red", data:{}};

    this.setState({selectDay: d, callCount: callCount});
    console.log(this.state.markedDates);
  }

  getCallDetails() {
    const {user_id} = this.props;
    // alert(this.props.user_id);
    // console.log("User Id : ", this.props.user_id);
    fetch(`${apiurl}fetch-user-casting-calls.php?user_id=${user_id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log(
          '---------------------- DATA CASTING CALL --------------------',
        );
        console.log(responseJson);
        var obj = {};

        for (let userObject of responseJson.data) {
          var key = userObject.date;
          var t = moment(key, 'DD-MM-YYYY');
          var formatted = moment(t).format('YYYY-MM-DD');
          console.log(key);
          obj[formatted] = {
            selected: false,
            marked: true,
            dotColor: 'red',
            data: userObject,
          };
          //obj[formatted] =  {selected: false,marked: true, dotColor: "red"};
        }
        console.log(obj);
        this.setState({markedDates: obj, data: responseJson.data});
        return responseJson.data;
      })
      .catch(error => {
        console.error(error);
      });
  }
  //
  // test() {
  //   const user = 'AVlcSkhnZxRefCETmFnrcd8LaR-RyhbRJAp1-6EPYDtjDr77lHlls6yxm33yVtQQxoRJCtTr_T1ZVFDS';
  //   const pass = 'EENUYrMIEaemD8VXXIeFEu4MYNbvHEh_YbgDyV-eAfEYIygAKWTljYIFPcmmjMJ8KZat_Aydhy8OrlJv';
  //
  //   fetch("https://api.sandbox.paypal.com/v1/oauth2/token", {
  //             method: 'POST',
  //             headers: {
  //             "Authorization", "Basic " + base64.encode("user:password");
  //             'Content-Type': 'application/x-www-form-urlencoded',
  //           },
  //           body: JSON.stringify({
  //             grant_type: 'client_credentials',
  //           })
  //         })
  //         .then((response) => {
  //
  //           return response.json();
  //         })
  //         .then((responseJson) => {
  //           console.log("---------------------- DATA --------------------");
  //           console.log(responseJson);
  //           // this.setState({allCategory: responseJson.data});
  //           return responseJson.data;
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  // }

  render() {
    return (
      <ScrollView>
        {
          <Calendar
            style={{height: 325}}
            markedDates={this.state.markedDates}
            theme={{
              backgroundColor: 'gray',
              calendarBackground: 'gray',
              textSectionTitleColor: '#FF0000',
              selectedDayBackgroundColor: '#FFFFFF',
              selectedDayTextColor: '#FF0000',
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
            onDayPress={day => {
              this.selectDay(day);
            }}
            //onDayLongPress={(day) => {alert(day)}}
          />
        }

        {
          <ScrollView style={{flexDirection: 'column'}}>
            <Text
              style={{
                textAlign: 'center',
                borderColor: '#ecf0f1',
                borderWidth: 1,
                height: 20,
                width: Dimensions.get('window').width,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {' '}
              {this.state.selectDay}
            </Text>
            {this.state.callCount > 0 ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={styles.callCountBlock}>
                    <Text style={styles.callCountText}>
                      {this.state.callCount}
                    </Text>
                  </View>
                </View>

                <TextView
                  style={{
                    textAlign: 'center',
                    color: '#707070',
                    height: 20,
                    fontFamily: 'Poppins-Medium',
                    fontSize: 11,
                  }}
                  text="Casting calls/Auditions are starting on this day"
                />
                <TouchableOpacity
                  style={{
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    width: '80%',
                    borderWidth: 1,
                    borderRadius: 25,
                    borderColor: 'red',
                    paddingHorizontal: 10,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('CalendarAndList', {
                      castingDetails: this.state.currentData,
                      date: this.state.selectDay,
                    })
                  }>
                  <TextView
                    style={{
                      textAlign: 'center',
                      color: '#707070',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 15,
                    }}
                    text="Click here to view them"
                  />
                  <Customon
                    style={{marginLeft: 10, color: 'red'}}
                    name="long-arrow-right"
                    size={12}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TextView
                style={{
                  textAlign: 'center',
                  color: '#707070',
                  height: 20,
                  fontFamily: 'Poppins-Medium',
                  fontSize: 11,
                }}
                text="No Casting calls are stating on this date"
              />
            )}
            {
              // <ImageBackground source={require('../images/empty-calendar.png')}
              // style={{width: Dimensions.get('window').width, height: 150, marginBottom: 10, }}>
              // </ImageBackground>
            }
          </ScrollView>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
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
  callCountBlock: {
    textAlign: 'center',
    color: '#707070',
    height: 50,
    width: 30,
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    paddingTop: 25,
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 3,
    marginBottom: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#f48282',
    alignItems: 'center',
  },
  callCountText: {
    color: '#FFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  individualroles: state.roles.roletypes,
  castingcallsdata: state.castingcallsdata.castingcallroles,
  selectedlocation: state.addpost.locationdescription,
});

export default connect(mapStateToProps, {rolesAction, submitcastingcalls})(
  withNavigation(NoCastingCalls),
);
