import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Dimensions,
  TouchableHighlight,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  DatePickerAndroid
} from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import axios from 'axios';
import CastingCallRoles from '../components/CastingCallRoles';
import { rolesAction } from '../redux/actions/rolesAction';
import { submitcastingcalls } from '../redux/actions/postajob';
import { apiurl } from '../constants/config';

import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

const { height, width } = Dimensions.get('window');

// eslint-disable-next-line react/prefer-stateless-function
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      talent: '1',
      productiontype: [],
      selectedproduct: '1',
      startDate: '',
      endDate: '',
      title: '',
      description: '',
      date_venue: ''
    };
    this.endDate = this.endDate.bind(this);
    this.startDate = this.startDate.bind(this);
    this.submitJob = this.submitJob.bind(this);
  }

  componentWillMount() {
    this.props.rolesAction();
    axios
      .get(`${apiurl}fetch-production-type.php`)
      .then(res => this.setState({ productiontype: res.data.data }));
    // console.log(this.props.individualroles.data);
  }

  componentDidUpdate() {
    const { individualroles, selectedlocation } = this.props;
    console.log(individualroles, selectedlocation);
  }

  async startDate() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: Date.now(),
        minDate: Date.now()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.setState({ startDate: `${day}-${month}-${year}` });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  async endDate() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: Date.now()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.setState({ endDate: `${day}-${month}-${year}` });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  async submitJob() {
    const { castingcallsdata, selectedlocation, user_id } = this.props;
    const {
      title,
      selectedproduct,
      description,
      startDate,
      endDate,
      date_venue,
      talent
    } = this.state;
    const newStart = startDate.split('-');
    const startval = new Date(newStart[2], newStart[1], newStart[0]);

    const newEnd = endDate.split('-');
    const endval = new Date(newEnd[2], newEnd[1], newEnd[0]);
    if (title.length < 2) {
      return alert('Title of Casting Call too short');
    }
    if (startval > endval) {
      return alert('Enter a valid end date');
    }
    if (selectedlocation === '') {
      return alert('Please enter a valid location');
    }
    const production_type = selectedproduct;
    const start_date = startDate;
    const application_deadline = endDate;
    const { role_description } = castingcallsdata;
    const age_from = castingcallsdata.sliderpoints[0];
    const age_to = castingcallsdata.sliderpoints[1];
    const { gender } = castingcallsdata;
    const skill_id = talent;
    const role_type = castingcallsdata.selectedrole;
    const { city, country, formatted_address, lng, lat } = selectedlocation;
    const roles_count = 1;
    // const roles = { role_description, age_from, age_to }
    const data = {
      title,
      production_type,
      description,
      start_date,
      application_deadline,
      date_venue,
      role_description,
      age_from,
      age_to,
      gender,
      skill_id,
      role_type,
      lng,
      lat,
      city,
      country,
      formatted_address,
      roles_count
    };
    this.setState({ loading: true });
    await axios
      .post(`${apiurl}add-casting-call.php?user_id=${user_id}`, data)
      .then(res => {
        // console.log(res.data);
        if (res.data.status === 'success') {
          this.props.routeOnSuccess('mypostedjobs');
          alert(res.data.message);
        } else {
          alert('an error occurred');
        }
      })
      .catch(res => console.log(res.data));
    // this.props.submitcastingcalls(data);
    this.setState({ loading: false });
    // console.log(data);
  }

  render() {
    const { individualroles, selectedlocation } = this.props;
    const { productiontype, selectedproduct, startDate, endDate, loading } = this.state;
    const { data } = individualroles;
    return (


        <View
          style={{
            backgroundColor: '#ffffff',
            alignSelf: 'center',
            alignItems: 'center',
            paddingTop: 20,
            flexDirection:"column"
          }}>

              <View>
                  <Calendar
                      markedDates={this.state.markedDates}
                      onDayPress={(day) => {this.selectDay(day)}}
                      //onDayLongPress={(day) => {alert(day)}}
                    />
              </View>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('CalendarAndList',{castingDetails:this.state.currentData,date:this.state.selectDay})}>
                <Text style={{textAlign:'center',color: '#707070',height: 20, fontFamily: 'Poppins-Medium', fontSize: 15}}>Click here to view them</Text>
              </TouchableOpacity>


              <View>
                  <Text style={{textAlign:'center',borderColor: '#ecf0f1', borderWidth:1, height: 20,width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center'}}> {this.state.selectDay}</Text>
                  {!this.state.callCount > 0 ? (
                    <View>
                        <Text style={{textAlign:'center',color: '#707070',height: 20, fontFamily: 'Poppins-Medium', fontSize: 11}}>{this.state.callCount}</Text>
                        <Text style={{textAlign:'center',color: '#707070',height: 20, fontFamily: 'Poppins-Medium', fontSize: 11}}>Casting calls/Auditions are starting on this day</Text>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('CalendarAndList',{castingDetails:this.state.currentData,date:this.state.selectDay})}>
                          <Text style={{textAlign:'center',color: '#707070',height: 20, fontFamily: 'Poppins-Medium', fontSize: 15}}>Click here to view them</Text>
                        </TouchableOpacity>
                    </View>
                  )
                  : (<Text style={{textAlign:'center',color: '#707070',height: 20, fontFamily: 'Poppins-Medium', fontSize: 11}}>No Casting calls are stating on this date</Text>)}
                  {
                      // <ImageBackground source={require('../images/empty-calendar.png')}
                      // style={{width: Dimensions.get('window').width, height: 150, marginBottom: 10, }}>
                      // </ImageBackground>
                  }
              </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  menutext: {
    fontSize: 9
  },
  menubutton: { flex: 1, alignItems: 'center' },
  lastmenubutton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    height: 60
  },
  titlestyle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#414141',
    marginBottom: 10
  },
  titlestyle2: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#414141',
    marginBottom: 5
  }
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  individualroles: state.roles.roletypes,
  castingcallsdata: state.castingcallsdata.castingcallroles,
  selectedlocation: state.addpost.locationdescription
});

export default connect(
  mapStateToProps,
  { rolesAction, submitcastingcalls }
)(withNavigation(Test));
