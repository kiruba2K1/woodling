import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Dimensions,
  Platform,
  TouchableHighlight,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  DatePickerAndroid,
  DatePickerIOS,
  AsyncStorage,
} from 'react-native';
import {Portal, Modal} from 'react-native-paper';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import axios from 'axios';
import CastingCallRoles from '../components/CastingCallRoles';
import {rolesAction} from '../redux/actions/rolesAction';
import {submitcastingcalls} from '../redux/actions/postajob';
import {apiurl} from '../constants/config';
import TextView from '../components/TextView';
const {height, width} = Dimensions.get('window');
import language from '../constants/language.js';
// eslint-disable-next-line react/prefer-stateless-function
class PostAJob extends Component {
  multiform = [1];
  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      loading: false,
      talent: '1',
      productiontype: [],
      selectedproduct: '1',
      startDate: '',
      endDate: '',
      title: '',
      description: '',
      date_venue: '',
      istart_date: new Date(),
      iend_date: new Date(),
      show: 'start_date',
      production_type_other: '',
      lan: 'en',
    };
    this.endDate = this.endDate.bind(this);
    this.startDate = this.startDate.bind(this);
    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.submitJob = this.submitJob.bind(this);
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if (value == 'fr') {
          this.setState({
            lan: 'fr',
          });
        } else {
          this.setState({
            lan: 'en',
          });
        }
      } else {
        alert('Else exicute : ' + value);
      }
    } catch (error) {
      //alert("error");
      console.log('--------- Error', error);
      // Error retrieving data
    }
  };

  componentDidMount() {
    this.props.rolesAction();
    axios.get(`${apiurl}fetch-production-type.php`).then(res => {
      this.setState({
        productiontype: res.data.data,
        selectedproduct: res.data.data[1].id,
      });
    });
    // console.log(this.props.individualroles.data);
  }

  // componentDidUpdate() {
  //   const {individualroles, selectedlocation} = this.props;
  //   console.warn(selectedlocation);
  // }

  setStartDate = istart_date => {
    const day = istart_date.getUTCDate();
    const month = istart_date.getUTCMonth() + 1;
    const year = istart_date.getFullYear();
    const hour = istart_date.getHours();
    const minute = istart_date.getMinutes();
    const seconds = istart_date.getSeconds();
    // console.warn(day, month, year);
    this.setState({
      istart_date,
      startDate: `${day}-${month}-${year}`,
      time: `${hour} : ${minute} : ${seconds}`,
    });
  };

  setEndDate = iend_date => {
    const day = iend_date.getUTCDate();
    const month = iend_date.getUTCMonth() + 1;
    const year = iend_date.getFullYear();
    const hour = iend_date.getHours();
    const minute = iend_date.getMinutes();
    const seconds = iend_date.getSeconds();
    // console.warn(day, month, year);
    this.setState({
      iend_date,
      endDate: `${day}-${month}-${year}`,
      time: `${hour} : ${minute} : ${seconds}`,
    });
  };

  async startDate() {
    if (Platform.OS === 'android') {
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: Date.now(),
          minDate: Date.now(),
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          // Selected year, month (0-11), day
          this.setState({startDate: `${day}-${parseInt(month) + 1}-${year}`});
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
    }
    if (Platform.OS === 'ios') {
      this.setState({show: 'start_date'});
    }
  }

  async endDate() {
    const {startDate} = this.state;
    const sdate = startDate.split('-');
    // console.warn(sdate);
    if (Platform.OS === 'android') {
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          // Use `new Date()` for current date.
          // May 25 2020. Month 0 is January.
          date: Date.now(),
          minDate:
            sdate.length === 3
              ? new Date(
                  parseInt(sdate[2]),
                  parseInt(sdate[1] - 1),
                  parseInt(sdate[0]),
                )
              : new Date(),
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          // Selected year, month (0-11), day
          this.setState({endDate: `${day}-${parseInt(month) + 1}-${year}`});
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
    }
    if (Platform.OS === 'ios') {
      this.setState({show: 'end_date'});
    }
  }

  actualSubmission(data) {
    const {user_id} = this.props;
    // console.warn(data, user_id)
    this.setState({loading: true});
    axios
      .post(`${apiurl}add-casting-call.php?user_id=${user_id}`, data)
      .then(res => {
        console.warn(res.data);
        if (res.data.status === 'success') {
          this.props.routeOnSuccess('mypostedjobs');
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
      })
      .catch(res => console.log(res.data));
    // this.props.submitcastingcalls(data);
    this.setState({loading: false});
  }

  async submitJob() {
    // console.warn(this.multiform);
    const {
      castingcallsdata,
      selectedlocation,
      user_id,
      navigation,
    } = this.props;
    const {
      title,
      selectedproduct,
      production_type_other,
      find_talent_other,
      description,
      startDate,
      endDate,
      date_venue,
      talent,
      lan,
    } = this.state;
    const newStart = startDate.split('-');
    const startval = new Date(newStart[2], newStart[1], newStart[0]);

    const newEnd = endDate.split('-');
    const endval = new Date(newEnd[2], newEnd[1], newEnd[0]);
    if (talent === 'other' && find_talent_other === '') {
      return alert('Enter your own Custom Talent Name');
    }
    if (selectedproduct === 'other' && production_type_other === '') {
      return alert('Enter your own Custom Production Type');
    }
    if (title.length < 2) {
      return alert('Title of Casting Call too short');
    }
    if (startval > endval) {
      return alert('Enter a valid end date');
    }
    if (startDate === '' || endDate === '') {
      return alert('Date Cannot be blank');
    }
    if (selectedlocation === '') {
      return alert('Please enter a valid location');
    }
    let roleTypeError = this.multiform.find(
      e => e.role_type_id === '' || !e.role_type_id,
    );
    if (roleTypeError) {
      return alert('role type cannot be blank');
    }
    const production_type =
      selectedproduct === 'other' ? production_type_other : selectedproduct;
    const start_date = startDate;
    const application_deadline = endDate;
    const role_type = this.multiform;
    const skill_id = talent === 'other' ? find_talent_other : talent;
    const {city, country, formatted_address, lng, lat} = selectedlocation;
    const roles_count = this.multiform.length;
    const data = {
      title,
      production_type,
      description,
      start_date,
      application_deadline,
      date_venue,
      skill_id,
      role_type,
      lng,
      lat,
      city,
      country,
      formatted_address,
      roles_count,
    };
    axios
      .get(`${apiurl}fetch-premium-user-details.php?user_id=${user_id}`)
      .then(res => {
        const no_of_calls = parseInt(
          res.data.premium_details[0].free_casting_calls,
        );
        // console.warn(no_of_calls);
        if (no_of_calls > 0) {
          this.actualSubmission(data);
        } else {
          navigation.navigate('CastingCallPayments', {data});
        }
      })
      .catch(res => console.warn(res.data));
    // console.warn(data);
  }

  getData = (e, index) => {
    this.multiform[index] = e;
  };

  deleteRole = index => {
    this.multiform.splice(index, 1);
    this.setState({});
  };

  render() {
    const {individualroles, selectedlocation} = this.props;
    const {
      productiontype,
      selectedproduct,
      startDate,
      endDate,
      loading,
      show,
      istart_date,
      iend_date,
      production_type_other,
      find_talent_other,
      lan,
    } = this.state;
    const {data} = individualroles;
    return (
      <ScrollView contentContainerStyle={{backgroundColor: '#f1f1f1'}}>
        <Portal>
          <Modal visible={loading} dismissable={false}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                borderRadius: 50,
              }}>
              <ActivityIndicator size="large" color="#fb0201" />
            </View>
          </Modal>
        </Portal>
        <ScrollView
          nestedScrollEnabled
          overScrollMode="always"
          contentContainerStyle={{
            backgroundColor: '#ffffff',
            elevation: 5,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 20,
          }}>
          <View style={{backgroundColor: '#ffffff'}}>
            <View>
              <TextView style={styles.titlestyle2} text="Title" />
              <TextInput
                placeholder={language.promotions.write_production_title(lan)}
                style={{
                  width: '90%',
                  borderBottomWidth: 1,
                  borderBottomColor: '#dedede',
                  marginBottom: 10,
                }}
                onChangeText={title => this.setState({title})}
              />
            </View>
            <View>
              <View style={{marginBottom: 10}}>
                <TextView style={styles.titlestyle} text="Production Type" />
                <View
                  style={{
                    borderWidth: 1,
                    width: 150,
                    // height: 23,
                    borderColor: '#dedede',
                    borderRadius: 20,
                  }}>
                  {productiontype !== [] && (
                    <Picker
                      selectedValue={selectedproduct}
                      itemStyle={{height: 300}}
                      style={{
                        // borderBottomWidth: 2,
                        // height: 23,
                        width: 150,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({selectedproduct: itemValue});
                      }}>
                      {productiontype
                        .concat({name: 'other', id: 'other'})
                        .map(e => (
                          <Picker.Item
                            label={e.name}
                            value={e.id}
                            key={e.id}
                            style={{fontSize: 10, fontFamily: 'Poppins-Medium'}}
                          />
                        ))}
                    </Picker>
                  )}
                </View>
              </View>
              {selectedproduct === 'other' && (
                <View style={{paddingVertical: 20}}>
                  <TextInput
                    placeholder={language.promotions.wrire_production_type_here(
                      lan,
                    )}
                    style={{borderBottomWidth: 1}}
                    value={production_type_other}
                    onChangeText={production_type_other =>
                      this.setState({production_type_other})
                    }
                  />
                </View>
              )}
            </View>
            <View style={{marginTop: 20}}>
              <TextView style={styles.titlestyle} text="Description" />
              <TextInput
                multiline
                style={{
                  width: '90%',
                  borderWidth: 1,
                  borderColor: '#dedede',
                  padding: 8,
                  minHeight: 150,
                  textAlignVertical: 'top',
                }}
                placeholder={language.promotions.wrire_production_description_here(
                  lan,
                )}
                onChangeText={description => this.setState({description})}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <TextView
                    style={[styles.titlestyle, {marginRight: 5}]}
                    text="Start Date"
                  />

                  <Icon
                    name="info-circle"
                    style={{justifyContent: 'center', marginTop: 4}}
                  />
                </View>
                {startDate === '' && (
                  <TouchableOpacity
                    onPress={this.startDate}
                    style={{flexDirection: 'row'}}>
                    <Icon name="plus" size={15} />
                    <TextView
                      style={{
                        fontSize: 13,
                        fontFamily: 'Poppins-Medium',
                        marginLeft: 10,
                      }}
                      text="Add Date"
                    />
                  </TouchableOpacity>
                )}
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 13, fontFamily: 'Poppins-Medium'}}>
                    {startDate}
                  </Text>
                  {startDate !== '' && (
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-medium',
                        fontSize: 11,
                      }}
                      onPress={this.startDate}>
                      &nbsp;Change
                    </Text>
                  )}
                </View>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <TextView
                    style={[styles.titlestyle, {marginRight: 5}]}
                    text="End Date"
                  />
                  <Icon
                    name="info-circle"
                    style={{justifyContent: 'center', marginTop: 4}}
                  />
                </View>
                {endDate === '' && (
                  <TouchableOpacity
                    onPress={this.endDate}
                    style={{flexDirection: 'row'}}>
                    <Icon name="plus" size={15} />
                    <TextView
                      style={{
                        fontSize: 13,
                        fontFamily: 'Poppins-Medium',
                        marginLeft: 10,
                      }}
                      text="Add Date"
                    />
                  </TouchableOpacity>
                )}
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 13, fontFamily: 'Poppins-Medium'}}>
                    {endDate}
                  </Text>
                  {endDate !== '' && (
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-medium',
                        fontSize: 11,
                      }}
                      onPress={this.endDate}>
                      &nbsp;Change
                    </Text>
                  )}
                </View>
              </View>
            </View>
            {Platform.OS === 'ios' && (
              <View>
                {show === 'start_date' && (
                  <DatePickerIOS
                    date={istart_date}
                    mode="date"
                    style={{width: 300}}
                    minimumDate={new Date()}
                    onDateChange={this.setStartDate}
                  />
                )}
                {show === 'end_date' && (
                  <DatePickerIOS
                    date={iend_date}
                    style={{width: 300}}
                    mode="date"
                    minimumDate={istart_date}
                    onDateChange={this.setEndDate}
                  />
                )}
              </View>
            )}
            <View style={{marginTop: 20}}>
              <TextView style={styles.titlestyle} text="Location" />
              {selectedlocation.formatted_address === undefined ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('AddLocationRoute')
                  }
                  style={{flexDirection: 'row'}}>
                  <Icon name="plus" size={15} />
                  <TextView
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Medium',
                      marginLeft: 10,
                    }}
                    text="Add Location"
                  />
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>{selectedlocation.formatted_address}</Text>
                  <Text
                    style={{
                      color: 'red',
                      fontFamily: 'Poppins-medium',
                      fontSize: 11,
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('AddLocationRoute')
                    }>
                    &nbsp;Change
                  </Text>
                </View>
              )}
            </View>
            <View style={{marginTop: 20}}>
              <TextView style={styles.titlestyle2} text="Dates and Venues" />
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#dedede',
                  width: '90%',
                }}
                placeholder={language.promotions.wrire_date_venue_here(lan)}
                onChangeText={date_venue => this.setState({date_venue})}
              />
            </View>
            <View
              style={{
                marginTop: 20,
                marginLeft: -20,
                margin: 'auto',
                width,
                height: 1,
                backgroundColor: '#dedede',
              }}
            />
            <View>
              <TextView
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
                text="Role(s)"
              />

              <TextView style={styles.titlestyle} text="Find Talent" />
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: '#dedede',
                  // height: 23,
                  width: 150,
                }}>
                {data !== undefined && (
                  <Picker
                    itemStyle={{
                      height: 200,
                    }}
                    style={{
                      // height: 23,
                      width: 150,
                      fontSize: 11,
                      fontFamily: 'Poppins-Medium',
                      color: '#000',
                    }}
                    selectedValue={this.state.talent}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({talent: itemValue})
                    }>
                    {data.concat({name: 'other', id: 'other'}).map(e => (
                      <Picker.Item label={e.name} value={e.id} key={e.id} />
                    ))}
                  </Picker>
                )}
              </View>
              <View>
                {this.state.talent === 'other' && (
                  <View style={{paddingVertical: 20}}>
                    <TextInput
                      style={{borderBottomWidth: 1}}
                      placeholder={language.promotions.enter_text_here(lan)}
                      value={find_talent_other}
                      onChangeText={find_talent_other =>
                        this.setState({find_talent_other})
                      }
                    />
                  </View>
                )}
              </View>
            </View>
            {this.multiform.map((e, index) => (
              <CastingCallRoles
                key={index}
                index={index}
                datum={this.getData}
                deleteRole={this.deleteRole}
              />
            ))}
          </View>
        </ScrollView>

        <View
          style={{
            height: 300,
            width,
            backgroundColor: '#ffffff',
            paddingTop: 20,
          }}>
          <View style={{width, height: 1, backgroundColor: '#dedede'}} />
          <View
            style={{
              paddingBottom: 30,
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                this.multiform.push({loading: 3});
                this.setState({});
              }}>
              <Icon name="plus" />
              <TextView
                style={{
                  fontFamily: 'Poppins-Medium',
                  paddingLeft: 5,
                  fontSize: 12,
                }}
                text="Add Another Role"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={this.submitJob}
            style={{
              borderRadius: 20,
              backgroundColor: 'red',
              paddingVertical: 7,
              paddingHorizontal: 100,
              alignSelf: 'center',
            }}>
            <TextView style={{color: 'white', fontSize: 15}} text="Post" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menutext: {
    fontSize: 9,
  },
  menubutton: {flex: 1, alignItems: 'center'},
  lastmenubutton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    height: 60,
  },
  titlestyle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#414141',
    marginBottom: 10,
  },
  titlestyle2: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#414141',
    marginBottom: 5,
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
  withNavigation(PostAJob),
);
