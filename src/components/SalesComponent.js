import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  Picker,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Avatar,
  RadioButton,
  Checkbox,
  Menu,
  Divider,
  Portal,
  Modal,
} from 'react-native-paper';
import Swiper from 'react-native-swiper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {withNavigation} from 'react-navigation';
import CountryPicker from 'react-native-country-picker-modal';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {connect} from 'react-redux';
import {postValues} from '../redux/actions/handleYourMind';
import TextView from './TextView';
import {
  fetchProductionType,
  fetchProductType,
  fetchServiceType,
} from '../redux/actions/fetchProductionType';

import fontelloConfig from '../config.json';
import {imageurl} from '../constants/config';

const Customon = createIconSetFromFontello(fontelloConfig);

const {height, width} = Dimensions.get('window');
class SalesComponent extends Component {
  state = {
    category: 'product',
    screenHeight: 0,
    // value: '',
    product_type_id: '2',
    product_type_other: '',
    service_type_id: '1',
    service_type_other: '',
    privacy: 'public',
    visible: false,
    cca2: 'US',
    currency: 'USD',
    name: '',
    price: '0',
    description: '',
    purpose: 'sell',
    showModal: false,
    image: [],
  };

  componentDidMount() {
    this.props.fetchProductionType();
    this.props.fetchProductType();
    this.props.fetchServiceType();
  }

  componentDidUpdate() {
    const {
      name,
      category,
      product_type_id,
      product_type_other,
      service_type_id,
      service_type_other,
      purpose,
      privacy,
      price,
      currency,
      description,
      image,
    } = this.state;
    const {selectedlocation, producttype} = this.props;
    const datum = {
      name,
      category,
      image,
      product_type_id:
        product_type_id === 'other' ? product_type_other : product_type_id,
      service_type_id:
        service_type_id === 'other' ? service_type_other : service_type_id,
      purpose,
      privacy,
      price,
      currency,
      description,
      ...selectedlocation,
    };
    console.log(selectedlocation);
    this.props.postValues(datum);
  }

  onContentSizeChange = (screenWidth, screenHeight) => {
    this.setState({screenHeight});
  };

  fromGallery = () => {
    this.setState({showModal: false});
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      maxFiles: 5,
      multiple: true,
      cropping: true,
      compressImageQuality: 0.6,
    })
      .then(image => {
        // const c = image.path.split('/');
        // const len = c.length - 1;
        // const photo = {
        //   uri: image.path,
        //   type: image.mime,
        //   name: c[len],
        //   size: image.size,
        // };
        // console.log(photo);
        // this.setState({photo});
        if (this.state.image.length <= 5)
          this.setState({image: [...this.state.image, ...image]});
        else
          Toast.show('You can only add 5 pictures at a time', {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
      })
      .catch(res => console.log(res.data));
  };

  fromCamera = () => {
    this.setState({showModal: false});
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      multiple: true,
      maxFiles: 5,
      cropping: true,
      compressImageQuality: 0.6,
    })
      .then(image => {
        // const c = image.path.split('/');
        // const len = c.length - 1;
        // const photo = {
        //   uri: image.path,
        //   type: image.mime,
        //   name: c[len],
        //   size: image.size,
        // };
        // this.setState({photo});
        // console.log(photo);
        if (this.state.image.length <= 5)
          this.setState({image: [...this.state.image, ...[image]]});
        else
          Toast.show('You can only add 5 pictures at a time', {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
      })
      .catch(res => console.log(res.data));
  };

  render() {
    const {
      category,
      product_type_id,
      product_type_other,
      service_type_id,
      service_type_other,
      checked,
      privacy,
      visible,
      price,
      description,
      purpose,
      name,
      currency,
      showModal,
    } = this.state;
    const {
      producttype,
      servicetype,
      selectedlocation,
      username,
      profilepicture,
    } = this.props;
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#eeeeee',
          marginBottom: 210,
        }}>
        <Portal>
          <Modal
            visible={showModal}
            onDismiss={() => this.setState({showModal: false})}>
            <View style={{alignSelf: 'center'}}>
              <View style={styles.imagePicker}>
                <TouchableOpacity
                  onPress={this.fromGallery}
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
                  onPress={this.fromCamera}
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
        <ScrollView
          scrollEnabled
          contentContainerStyle={{
            width: width - 20,
            marginTop: 20,
            backgroundColor: '#ffffff',
            borderRadius: 25,
          }}
          onContentSizeChange={this.onContentSizeChange}>
          <View
            style={{
              flex: 1.5,
              paddingTop: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Avatar.Image
                size={50}
                source={
                  profilepicture === ''
                    ? require('../images/Avatar_invisible_circle_1.png')
                    : {uri: `${imageurl}/${profilepicture}`}
                }
              />
              <Text
                style={{
                  color: '#bcc5d3',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 10,
                }}>
                @{username}
              </Text>
            </View>
            {/* <FontAwesome5
                  name="shopping-cart"
                  size={15}
                  color="#d1d1d1"
                  style={{ paddingRight: 20 }}
                /> */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 30,
              }}>
              <Menu
                visible={this.state.visible}
                onDismiss={() => this.setState({visible: false})}
                anchor={
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => this.setState({visible: true})}>
                    <FontAwesome5
                      name={privacy === 'private' ? 'lock' : 'lock-open'}
                      size={16}
                    />
                    <Text
                      style={{
                        textAlignVertical: 'center',
                        textTransform: 'capitalize',
                        marginHorizontal: 3,
                        fontFamily: 'Poppins-Medium',
                        fontSize: 13,
                        marginLeft: 5,
                        color: '#808080',
                      }}>
                      {privacy}
                    </Text>
                    <FontAwesome5
                      name="caret-down"
                      size={16}
                      style={{alignSelf: 'center'}}
                    />
                  </TouchableOpacity>
                }>
                <Menu.Item
                  onPress={() =>
                    this.setState({privacy: 'public', visible: false})
                  }
                  title="public"
                />
                <Divider />
                <Menu.Item
                  onPress={() =>
                    this.setState({privacy: 'private', visible: false})
                  }
                  title="private"
                />
              </Menu>
            </View>
          </View>
          <View style={{paddingHorizontal: 20}}>
            <View style={[styles.itemContainer, {alignItems: 'center'}]}>
              <TextView
                style={{
                  color: '#414141',
                  fontSize: 17,
                  textAlign: 'center',
                  fontFamily: 'Poppins-Medium',
                }}
                text='What do you want to sell?'>

              </TextView>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={[
                    styles.saleTypeButton,
                    {
                      backgroundColor:
                        category === 'product' ? '#fb0201' : '#ffffff',
                    },
                  ]}
                  onPress={() => this.setState({category: 'product'})}>
                  <TextView
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Medium',
                      color: category === 'product' ? '#ffffff' : '#3e3e3e',
                    }} text='Product'>

                  </TextView>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saleTypeButton,
                    {
                      backgroundColor:
                        category === 'service' ? '#fb0201' : '#ffffff',
                    },
                  ]}
                  onPress={() => this.setState({category: 'service'})}>
                  <TextView
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Medium',
                      color: category === 'service' ? '#ffffff' : '#3e3e3e',
                    }} text='Service'>

                  </TextView>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View style={{alignItems: 'center'}}>
                {this.state.image.length > 0 ? (
                  <Swiper height={200} width={300} style={{marginBottom: 10}}>
                    {this.state.image.map((value, index) => {
                      return (
                        <View>
                          <Image
                            source={
                              value.path === undefined
                                ? require('../images/Product-placeholder-img.png')
                                : {uri: value.path}
                            }
                            style={styles.productImage}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              this.state.image.splice(index, 1);
                              this.forceUpdate();
                            }}
                            style={{position: 'absolute', top: 10, right: 10}}>
                            <FontAwesome5
                              name="window-close"
                              color="#fff"
                              size={30}
                              style={{alignSelf: 'center'}}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </Swiper>
                ) : null}
                <TouchableOpacity
                  onPress={() => this.setState({showModal: true})}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Customon
                      name="plus-circle"
                      size={20}
                      style={{marginHorizontal: 10}}
                      color="#fb0201"
                    />
                    <TextView
                      style={{
                        color: '#fb0201',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 13,
                      }} text='Add Photo (s)'>

                    </TextView>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {category === 'product' && (
              <View style={styles.itemContainer}>
                <TextView style={styles.fieldTitle} text='Add Product Name'></TextView>
                <TextInput
                  placeholder="Write name of product"
                  value={name}
                  onChangeText={name => this.setState({name})}
                  style={{
                    width: 219,
                    height: 23,
                    padding: 0,
                    borderBottomWidth: 0.5,
                  }}
                />
              </View>
            )}
            {category === 'service' && (
              <View style={styles.itemContainer}>
                <TextView style={styles.fieldTitle} text='Title'></TextView>
                <TextInput
                  onChangeText={name => this.setState({name})}
                  value={name}
                  placeholder="Write name of product"
                  style={{
                    width: 219,
                    height: 23,
                    padding: 0,
                    borderBottomWidth: 0.5,
                  }}
                />
              </View>
            )}
            {category === 'product' && (
              <View style={styles.itemContainer}>
                <TextView style={styles.fieldTitle} text='Add Product Type'></TextView>
                <View
                  style={{
                    borderWidth: 1,
                    width: 150,
                    // height: 23,
                    borderColor: '#dedede',
                    borderRadius: 20,
                  }}>
                  <Picker
                    mode="dialog"
                    selectedValue={product_type_id}
                    itemStyle={{
                      height: 100,
                      elevation: 20,
                      backgroundColor: '#fff',
                    }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({product_type_id: itemValue})
                    }>
                    {producttype.concat({name: 'other', id: 'other'}).map(e => (
                      <Picker.Item label={e.name} value={e.id} key={e.id} />
                    ))}
                  </Picker>
                </View>
                {product_type_id === 'other' && (
                  <TextInput
                    placeholder="enter your product type here"
                    value={product_type_other}
                    onChangeText={text =>
                      this.setState({product_type_other: text})
                    }
                  />
                )}
              </View>
            )}
            {category === 'service' && (
              <View style={styles.itemContainer}>
                <TextView style={styles.fieldTitle} text='Type of Service'></TextView>
                <View
                  style={{
                    borderWidth: 1,
                    width: 150,
                    // height: 23,
                    borderColor: '#dedede',
                    borderRadius: 20,
                  }}>
                  <Picker
                    selectedValue={service_type_id}
                    itemStyle={{
                      height: 100,
                      elevation: 20,
                      backgroundColor: '#fff',
                    }}
                    // style={{
                    //   borderBottomWidth: 1,
                    //   height: 23,
                    //   width: 150,
                    //   // fontFamily: 'Poppins-Medium',
                    //   // fontSize: 13,
                    //   // color: '#000000',
                    // }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({service_type_id: itemValue})
                    }>
                    {servicetype.concat({name: 'other', id: 'other'}).map(e => (
                      <Picker.Item label={e.name} value={e.id} key={e.id} />
                    ))}
                  </Picker>
                </View>
                {service_type_id === 'other' && (
                  <TextInput
                    placeholder="enter your service type here"
                    value={service_type_other}
                    onChangeText={text =>
                      this.setState({service_type_other: text})
                    }
                  />
                )}
              </View>
            )}
            {category === 'product' && (
              <View style={styles.itemContainer}>
                <TextView style={styles.fieldTitle} text='Looking to...'></TextView>
                <View style={{flexDirection: 'row'}}>
                  <RadioButton.Group
                    onValueChange={purpose => this.setState({purpose})}
                    value={this.state.purpose}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RadioButton color="#0ce0b5" value="sell" />
                      <TextView text='Sell'></TextView>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RadioButton color="#0ce0b5" value="rent" />
                      <TextView text='Rent'></TextView>
                    </View>
                  </RadioButton.Group>
                </View>
              </View>
            )}
            <View style={styles.itemContainer}>
              <TextView style={styles.fieldTitle} text='Choose Currency'></TextView>
              {/* <Text
                ref={countryPicker => {
                  this.countryPicker = countryPicker;
                }}
                onPress={value => console.log(value)}>
                Select a currency
              </Text> */}
              <View style={{flexDirection: 'row'}}>
                <CountryPicker
                  ref={countryPicker => {
                    this.countryPicker = countryPicker;
                  }}
                  onChange={value => {
                    console.log(value);
                    this.setState({
                      cca2: value.cca2,
                      currency: value.currency,
                    });
                  }}
                  cca2={this.state.cca2}
                  translation="eng"
                />
                <Text>{currency}</Text>
              </View>
            </View>
            {category === 'product' && (
              <View style={styles.itemContainer}>
                <TextView style={styles.fieldTitle} text='Add Selling Price'></TextView>
                <TextInput
                  style={{
                    width: 219,
                    height: 23,
                    padding: 0,
                    borderBottomWidth: 0.5,
                  }}
                  keyboardType="number-pad"
                  value={price}
                  onChangeText={price => this.setState({price})}
                  placeholder="0"
                />
              </View>
            )}
            {category === 'service' && (
              <View style={styles.itemContainer}>
                <View style={{flexDirection: 'row'}}>
                  <TextView style={[styles.fieldTitle, styles.fieldT]} text='Cost of Service'>

                  </TextView>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Checkbox
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => {
                        this.setState({checked: !checked});
                      }}
                    />
                    <TextView text='Negotiable'></TextView>
                  </View>
                </View>
                <TextInput
                  style={{
                    width: 219,
                    height: 23,
                    padding: 0,
                    borderBottomWidth: 0.5,
                  }}
                  value={price}
                  onChangeText={price => this.setState({price})}
                  keyboardType="number-pad"
                  editable={checked}
                  placeholder="0"
                />
              </View>
            )}
            <View style={styles.itemContainer}>
              <TextView style={styles.fieldTitle} text='Location'></TextView>
              {selectedlocation.length === 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('AddLocationRoute')
                  }>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome5 name="plus" />
                    <TextView
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#3e3e3e',
                        marginLeft:3
                      }}
                      text=' Add Location'>

                    </TextView>
                  </View>
                </TouchableOpacity>
              ) : (
                <View>
                  {/* <Text>{selectedlocation.formatted_address}</Text> */}
                  <Text>
                    {/* {location.state ? location.formatted_address + ',' : null} */}
                    {selectedlocation.state}, {selectedlocation.country}
                  </Text>
                  <Text
                    style={{color: '#fb0201'}}
                    onPress={() =>
                      this.props.navigation.navigate('AddLocationRoute')
                    }>
                    change
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.itemContainer}>
              <TextView style={styles.fieldTitle} text='Add Product Description'></TextView>
              <TextInput
                placeholder="write description of product (100 characters)"
                multiline
                onChangeText={description => this.setState({description})}
                style={{
                  width: 255,
                  height: 181,
                  margin: 10,
                  textAlignVertical: 'top',
                  borderColor: '#dedede',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  backgroundColor: '#ffffff',
                  padding: 8,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saleTypeButton: {
    width: 100,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 25,
    borderColor: '#fb0201',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  itemContainer: {
    paddingVertical: 20,
  },

  fieldT: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldTitle: {
    color: '#414141',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
  },
  productImage: {
    width: 300,
    height: 200,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 8,
    borderRadius: 13,
    backgroundColor: '#fecbcb',
  },
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

const mapStateToProps = state => ({
  productiontype: state.fetchProductionType.productiontype,
  producttype: state.fetchProductionType.producttype,
  producttype: state.fetchProductionType.producttype,
  servicetype: state.fetchProductionType.servicetype,
  selectedlocation: state.addpost.locationdescription,
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  username: state.profilepicture.username,
});

export default connect(mapStateToProps, {
  fetchProductionType,
  fetchProductType,
  fetchServiceType,
  postValues,
})(withNavigation(SalesComponent));
