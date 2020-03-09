import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  StatusBar,
  DatePickerAndroid,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Avatar,
  Dialog,
  Portal,
  RadioButton,
  Menu,
  Divider,
  TextInput,
} from 'react-native-paper';
import axios from 'axios';
import {TextField} from 'react-native-material-textfield';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {individualformdata} from '../redux/actions/individualformdata';
import fontelloConfig from '../config.json';
import TextView from '../components/TextView';

const {width, height} = Dimensions.get('window');

const Customon = createIconSetFromFontello(fontelloConfig);

export class IndividualSetupFormScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressoptions: [],
      address: '',
      longlat: [],
      country: '',
      city: '',
      day: '',
      month: '',
      year: '',
      date_of_birth: '',
      showlocations: false,
      visible: false,
      dropdownvisibility: false,
      full_name: '',
      selectedImage: '',
      value: '',
      location: {},
      country: '',
    };
    this.locationChange = this.locationChange.bind(this);
    this.dateSelection = this.dateSelection.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.onPictureChange = this.onPictureChange.bind(this);
    this.onCameraSelect = this.onCameraSelect.bind(this);
    this.setDay = this.setDay.bind(this);
    this.setMonth = this.setMonth.bind(this);
    this.setYear = this.setYear.bind(this);
  }

  componentWillUpdate(prevprop, newstate) {
    if (newstate.gendervisibility === true) {
      Keyboard.dismiss();
    }
    const data = [
      newstate.full_name,
      newstate.date_of_birth,
      newstate.location,
      newstate.value,
      newstate.selectedImage,
    ];
    this.props.individualformdata(data);
  }

  componentDidUpdate(props, state) {
    if (state.value !== this.state.value) {
      this.setState({gendervisibility: false});
    }
    if (state.longlat !== this.state.longlat) {
      const a = this.state.longlat;
      a.formatted_address = this.state.address;
      a.city = this.state.city;
      a.country = this.state.country;
      this.setState({location: a});
    }
  }

  setDay = day => {
    const {month, year} = this.state;
    const date = `${day}-${month}-${year}`;
    this.setState({date_of_birth: date, day});
    console.log(day);
    if (day.length == 2) {
      this.monthField.focus();
    }
  };

  setMonth = month => {
    const {day, year} = this.state;
    const date = `${day}-${month}-${year}`;
    this.setState({date_of_birth: date, month});
    // console.log(month);
    if (month.length == 2) {
      this.yearField.focus();
    }
  };

  setYear = year => {
    const {month, day} = this.state;
    const date = `${day}-${month}-${year}`;
    this.setState({date_of_birth: date, year});
    // console.log(year);
    if (year.length == 4) {
      Keyboard.dismiss();
    }
  };

  hideDialog() {
    this.setState({visible: false});
  }

  locationChange(text) {
    console.log(text.length);
    if (text === '') {
      this.setState({address: text, dropdownvisibility: false});
    } else {
      this.setState({address: text, dropdownvisibility: true});
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDnd-OjoFVYBZjbB9ok_Pw8pGj0AyhLpjI&input=${text}&radius=50`,
        )
        .then(res => this.setState({addressoptions: res.data.predictions}));
    }
  }

  textSelected(e) {
    const {place_id} = e;
    const len = e.terms.length - 1;
    const cityindex = e.terms.length - 2;
    this.setState({address: e.description, country: e.terms[len].value});
    if (e.terms.length <= 1) {
      this.setState({city: ''});
    } else if (e.terms.length > 1) {
      this.setState({city: e.terms[cityindex].value});
    }
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=AIzaSyDnd-OjoFVYBZjbB9ok_Pw8pGj0AyhLpjI`,
      )
      .then(res =>
        this.setState({longlat: res.data.results[0].geometry.location}),
      );
    this.setState({showlocations: false});
  }

  onPictureChange() {
    this.setState({visible: false});
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({selectedImage: image});
    });
  }

  onCameraSelect() {
    this.setState({visible: false});
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({selectedImage: image});
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async dateSelection() {
    if (Platform.OS === 'android') {
      Keyboard.dismiss();
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          mode: 'spinner',
          date: new Date(1970, 1, 1),
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          const date = new Date(year, month, day);
          // const selected = date.toLocaleString('en-us', { month: 'long' })
          const monthlist = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          const totaldate = `${day}-${monthlist[month]}-${year}`;
          this.setState({date_of_birth: totaldate});
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
    }
  }

  selectedLocation(e) {
    this.setState({dropdownvisibility: false, addressoptions: []});
    const {place_id} = e;
    const len = e.terms.length - 1;
    const cityindex = e.terms.length - 2;
    this.setState({address: e.description, country: e.terms[len].value});
    if (e.terms.length <= 1) {
      this.setState({city: ''});
    } else if (e.terms.length > 1) {
      this.setState({city: e.terms[cityindex].value});
    }
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=AIzaSyDnd-OjoFVYBZjbB9ok_Pw8pGj0AyhLpjI`,
      )
      .then(res =>
        this.setState({longlat: res.data.results[0].geometry.location}),
      );
  }

  render() {
    const {
      addressoptions,
      address,
      date_of_birth,
      day,
      month,
      year,
      dropdownvisibility,
    } = this.state;
    return (
      <ScrollView contentContainerStyle={{height, width}}>
        <Portal>
          <Dialog visible={this.state.visible} onDismiss={this.hideDialog}>
            <Dialog.Content>
              <TextView
                style={{
                  paddingBottom: 10,
                  borderBottomWidth: 2,
                  borderBottomColor: 'grey',
                }}
                onPress={this.onPictureChange} text='Select an Image' />
              <TextView style={{paddingTop: 10}} onPress={this.onCameraSelect} text='Select from camera' />
            </Dialog.Content>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog
            visible={this.state.gendervisibility}
            onDismiss={() => this.setState({gendervisibility: false})}>
            <Dialog.Content>
              <RadioButton.Group
                onValueChange={value => this.setState({value})}
                value={this.state.value}>
                <View style={{flexDirection: 'row'}}>
                  <RadioButton value="Female" />
                  <TextView style={{textAlignVertical: 'center'}} text='Female' />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <RadioButton value="Male" />
                  <TextView style={{textAlignVertical: 'center'}} text='Male' />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <RadioButton value="Genderqueer" />
                  <TextView style={{textAlignVertical: 'center'}} text='Genderqueer/Non-binary' />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <RadioButton value="Transgender" />
                  <TextView style={{textAlignVertical: 'center'}} text='Transgender' />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <RadioButton value="Gender_Fluid" />
                  <TextView style={{textAlignVertical: 'center'}} text='Gender-Fluid' />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <RadioButton value="Rather not say" />
                  <TextView style={{textAlignVertical: 'center'}} text='Rather not Say' />
                </View>
              </RadioButton.Group>
            </Dialog.Content>
          </Dialog>
        </Portal>
        <ImageBackground
          source={require('../images/individualformbackground.png')}
          style={{flex: 1, backgroundColor: '#f1f1f1'}}>
          <View style={{flex: 3, alignItems: 'center'}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <TextView style={{fontSize: 20, fontWeight: '300'}} text='Setup' />
            </View>
            <View style={{flex: 1.5, paddingBottom: 10}}>
              {this.state.selectedImage.path === undefined ? (
                <Avatar.Image
                  style={{elevation: 3}}
                  size={110}
                  source={require('../images/Avatar_invisible_circle_1.png')}
                />
              ) : (
                <Avatar.Image
                  style={{elevation: 3}}
                  size={110}
                  source={{uri: this.state.selectedImage.path}}
                />
              )}
              <TouchableOpacity
                onPress={() => this.setState({visible: true})}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Customon name="plus-circle" color="red" size={20} />
                <TextView style={{color: 'red'}} text='Profile Picture' />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 6}}>
            <View
              style={{
                backgroundColor: 'white',
                elevation: 3,
                justifyContent: 'center',
                borderTopLeftRadius: 30,
                borderBottomRightRadius: 30,
                height: '75%',
              }}>
              <TextField
                value={this.state.full_name}
                onChangeText={text => this.setState({full_name: text})}
                label={
                  <Text>
                    Full Name<Text style={{color: 'red'}}>*</Text>
                  </Text>
                }
                containerStyle={{width: '80%', alignSelf: 'center'}}
                tintColor="black"
              />
              {/* <TextField
                value={date_of_birth}
                onFocus={this.dateSelection}
                label="Birthday"
                containerStyle={{ width: '80%', alignSelf: 'center' }}
                tintColor="black"
              /> */}
              <View
                style={{
                  width: '80%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                }}>
                {/* <TextInput label="day" style={{width: 50}} /> */}
                <TextInput
                  ref={ref => {
                    this.dayField = ref;
                  }}
                  mode="flat"
                  theme={{
                    colors: {
                      background: 'transparent',
                      primary: 'black',
                    },
                  }}
                  label="day"
                  value={day}
                  onChangeText={this.setDay}
                  style={{width: 50}}
                  maxLength={2}
                  keyboardType="number-pad"
                />
                <View style={styles.horizontalLine} />
                <TextInput
                  ref={ref => {
                    this.monthField = ref;
                  }}
                  mode="flat"
                  theme={{
                    colors: {
                      background: 'transparent',
                      primary: 'black',
                    },
                  }}
                  label="month"
                  value={month}
                  onChangeText={this.setMonth}
                  style={{width: 50}}
                  maxLength={2}
                  keyboardType="number-pad"
                />
                <View style={styles.horizontalLine} />
                <TextInput
                  ref={ref => {
                    this.yearField = ref;
                  }}
                  mode="flat"
                  theme={{
                    colors: {
                      background: 'transparent',
                      primary: 'black',
                    },
                  }}
                  label="year"
                  value={year}
                  onChangeText={this.setYear}
                  style={{width: 100}}
                  maxLength={4}
                  keyboardType="number-pad"
                />
              </View>
              <Menu
                visible={dropdownvisibility}
                style={{
                  width: '80%',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: 100,
                }}
                onDismiss={() => this.setState({dropdownvisibility: false})}
                anchor={
                  <KeyboardAvoidingView behavior="padding">
                    <TextField
                      value={address}
                      onChangeText={e => this.locationChange(e)}
                      // onFocus={() => this.setState({ showlocations: true })}
                      label={
                        <Text>
                          Location<Text style={{color: 'red'}}>*</Text>
                        </Text>
                      }
                      containerStyle={{width: '80%', alignSelf: 'center'}}
                      tintColor="black"
                    />
                  </KeyboardAvoidingView>
                }>
                {addressoptions.map(e => (
                  <Menu.Item
                    onPress={() => this.selectedLocation(e)}
                    title={e.description}
                  />
                ))}
              </Menu>
              {/* {this.state.showlocations === true && (
                <View
                  style={{
                    backgroundColor: '#f1f1f1',
                    elevation: 4,
                    width: '80%',
                    alignSelf: 'center',
                    position: 'absolute',
                    top: '40%'
                  }}>
                  <KeyboardAvoidingView behavior="padding">
                    {addressoptions.map(e => (
                      <Text
                        style={{
                          borderBottomWidth: 1,
                          paddingTop: 5,
                          paddingBottom: 5
                        }}
                        onPress={this.textSelected.bind(this, e)}
                        key={e.place_id}>
                        {e.description}
                      </Text>
                    ))}
                  </KeyboardAvoidingView>
                </View>
              )} */}
              <TextField
                caretHidden
                value={this.state.value}
                onFocus={() => {
                  this.setState({gendervisibility: true});
                }}
                label={
                  <Text>
                    Gender<Text style={{color: 'red'}}>*</Text>
                  </Text>
                }
                containerStyle={{width: '80%', alignSelf: 'center'}}
                tintColor="black"
              />
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  horizontalLine: {
    width: 10,
    height: 2,
    backgroundColor: '#000',
    alignSelf: 'center',
  },
});

export default connect(
  null,
  {individualformdata},
)(IndividualSetupFormScreen);
