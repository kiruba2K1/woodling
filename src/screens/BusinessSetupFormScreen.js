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
  Modal,
  RadioButton,
  Menu,
} from 'react-native-paper';
import axios from 'axios';
import {TextField} from 'react-native-material-textfield';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {businessformdata} from '../redux/actions/individualformdata';
import fontelloConfig from '../config.json';
import TextView from '../components/TextView';

const {width, height} = Dimensions.get('window');

const Customon = createIconSetFromFontello(fontelloConfig);

export class BusinessSetupFormScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressoptions: [],
      address: '',
      lng: '',
      lat: '',
      country: '',
      city: '',
      date_of_birth: '',
      showlocations: false,
      visible: false,
      business_name: '',
      business_description: '',
      business_phone: '',
      photo: '',
      value: '',
      formatted_address: '',
      country: '',
      dropdownvisibility: false,
    };
    this.locationChange = this.locationChange.bind(this);
    // this.dateSelection = this.dateSelection.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.onPictureChange = this.onPictureChange.bind(this);
    this.onCameraSelect = this.onCameraSelect.bind(this);
  }

  // componentWillUpdate(prevprop, newstate) {
  //   if (newstate.gendervisibility === true) {
  //     Keyboard.dismiss();
  //   }
  //   const data = [
  //     newstate.business_name,
  //     newstate.address,
  //     newstate.location,
  //     newstate.phone,
  //     newstate.selectedImage,
  //     newstate.businessdescription,
  //   ];
  //   this.props.businessformdata(data);
  // }

  componentDidUpdate(props, state) {
    const {
      business_name,
      business_description,
      business_phone,
      lng,
      lat,
      city,
      country,
      formatted_address,
      photo,
    } = this.state;
    const data = {
      business_name,
      business_description,
      business_phone,
      lng,
      lat,
      city,
      country,
      formatted_address,
      photo,
    };
    // console.log(data);
    this.props.businessformdata(data);
    // if (state.value !== this.state.value) {
    //   this.setState({gendervisibility: false});
    // }
    // if (state.longlat !== this.state.longlat) {
    //   const a = this.state.longlat;
    //   a.formatted_address = this.state.address;
    //   a.city = this.state.city;
    //   a.country = this.state.country;
    //   this.setState({location: a});
    // }
  }

  hideDialog() {
    this.setState({visible: false});
  }

  locationChange(text) {
    this.setState({address: text});
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDnd-OjoFVYBZjbB9ok_Pw8pGj0AyhLpjI&input=${text}&radius=50`,
      )
      .then(res => {
        console.log(res.data);
        this.setState({addressoptions: res.data.predictions});
      });
  }

  textSelected(e) {
    this.setState({dropdownvisibility: false});
    console.warn(e);
    const {place_id} = e;
    const len = e.terms.length - 1;
    const cityindex = e.terms.length - 2;
    this.setState({
      formatted_address: e.description,
      country: e.terms[len].value,
    });
    if (e.terms.length <= 1) {
      this.setState({city: ''});
    } else if (e.terms.length > 1) {
      this.setState({city: e.terms[cityindex].value});
    }
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=AIzaSyDnd-OjoFVYBZjbB9ok_Pw8pGj0AyhLpjI`,
      )
      .then(res => {
        this.setState({
          lng: res.data.results[0].geometry.location.lng,
          lat: res.data.results[0].geometry.location.lat,
        });
        console.log(res.data.results[0].geometry.location);
      });
    // this.setState({showlocations: false});
  }

  onPictureChange() {
    this.setState({visible: false});
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      const c = image.path.split('/');
      const len = c.length - 1;
      const photo = {
        uri: image.path,
        type: image.mime,
        name: c[len],
        size: image.size,
      };
      this.setState({photo});
      console.log(photo);
    });
  }

  onCameraSelect() {
    this.setState({visible: false});
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      const c = image.path.split('/');
      const len = c.length - 1;
      const photo = {
        uri: image.path,
        type: image.mime,
        name: c[len],
        size: image.size,
      };
      this.setState({photo});
      console.log(photo);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  // async dateSelection() {
  //   if (Platform.OS === 'android') {
  //       Keyboard.dismiss()
  //     try {
  //       const { action, year, month, day } = await DatePickerAndroid.open({
  //         mode: 'spinner',
  //         date: new Date(1970, 1, 1),
  //       });
  //       if (action !== DatePickerAndroid.dismissedAction) {
  //         const date = new Date(year, month, day);
  //         // const selected = date.toLocaleString('en-us', { month: 'long' })
  //         const monthlist = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  //         const totaldate =`${day}-${monthlist[month]}-${year}`
  //         this.setState({ date_of_birth: totaldate });
  //       }
  //     } catch ({ code, message }) {
  //       console.warn('Cannot open date picker', message);
  //     }
  //   }
  // }
  render() {
    const {
      addressoptions,
      formatted_address,
      business_phone,
      business_name,
      business_description,
      dropdownvisibility,
    } = this.state;
    return (
      <ScrollView contentContainerStyle={{height, width}}>
        <Portal>
          <Modal visible={this.state.visible} onDismiss={this.hideDialog}>
            <View style={{alignSelf: 'center'}}>
              <View style={styles.imagePicker}>
                <TouchableOpacity
                  onPress={this.onPictureChange}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRightWidth: 0.5,
                  }}>
                  <Customon name="images" size={40} />
                  <TextView style={styles.pickerText} text='Gallery'></TextView>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.onCameraSelect}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderLeftWidth: 0.5,
                  }}>
                  <Customon name="camera-alt" size={40} />
                  <TextView style={styles.pickerText} text='Camera'></TextView>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
        <ImageBackground
          source={require('../images/individualformbackground.png')}
          style={{flex: 1, backgroundColor: '#f1f1f1'}}>
          <View style={{flex: 3, alignItems: 'center'}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <TextView style={{fontSize: 20, fontWeight: '300'}} text='Setup'></TextView>
            </View>
            <View style={{flex: 1.5}}>
              {this.state.photo.uri === undefined ? (
                <Avatar.Image
                  style={{elevation: 3}}
                  size={110}
                  source={require('../images/Avatar_invisible_circle_1.png')}
                />
              ) : (
                <Avatar.Image
                  style={{elevation: 3}}
                  size={110}
                  source={{uri: this.state.photo.uri}}
                />
              )}
              <TouchableOpacity
                onPress={() => this.setState({visible: true})}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Customon name="plus-circle" color="red" size={20} />
                <TextView style={{color: 'red'}} text='Profile Picture'> </TextView>
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
                value={this.state.business_name}
                onChangeText={text => this.setState({business_name: text})}
                label={
                  <TextView text='Business Name *'>
                  </TextView>
                }
                containerStyle={{width: '80%', alignSelf: 'center'}}
                tintColor="black"
              />
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
                      value={formatted_address}
                      onChangeText={e => {
                        this.setState({
                          dropdownvisibility: true,
                          formatted_address: e,
                        });
                        this.locationChange(e);
                      }}
                      label={
                        <TextView text='Address *'>

                        </TextView>
                      }
                      containerStyle={{width: '80%', alignSelf: 'center'}}
                      tintColor="black"
                    />
                  </KeyboardAvoidingView>
                }>
                {addressoptions.map(e => (
                  <Menu.Item
                    onPress={() => this.textSelected(e)}
                    title={e.description}
                  />
                ))}
              </Menu>
              <TextField
                value={business_phone}
                onChangeText={e => this.setState({business_phone: e})}
                label={
                  <TextView text='Phone' />
                    
                }
                containerStyle={{width: '80%', alignSelf: 'center'}}
                tintColor="black"
              />
              <TextField
                onChangeText={text =>
                  this.setState({business_description: text})
                }
                value={business_description}
                label="Business Description"
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
  imagePicker: {
    width: 209,
    height: 123,
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  pickerText: {
    color: '#000000',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
});

export default connect(
  null,
  {businessformdata},
)(BusinessSetupFormScreen);
