import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import { Header, Avatar, Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import StarRating from 'react-native-star-rating';
import {
  Appbar,
  FAB,
  Portal,
  // Modal,
  Avatar as PaperAvatar,
} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import fontelloConfig from '../config.json';
import { localurl, apiurl, imageurl } from '../constants/config';
import LikeComponent from '../components/LikeComponent';
import GalleryPosts from '../components/GalleryPosts';
import ImageViewer from 'react-native-image-zoom-viewer';
const numeral = require('numeral');
const moment = require('moment');

const Customon = createIconSetFromFontello(fontelloConfig);
const { width, height } = Dimensions.get('window');
class ProductDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      productDetails: [],
      likelist: [],
      relatedproducts: [],
      imagePreview: false,
      images: [],
    };
  }

  componentDidMount() {
    const { navigation, user_id } = this.props;
    const productid = navigation.getParam('productid');
    const postid = navigation.getParam('postid');
    axios
      .get(
        `${apiurl}view-product-details.php?user_id=${user_id}&product_id=${productid}&post_id=${postid}`,
      )
      .then(res => {
        console.log(res.data);
        this.setState({ productDetails: res.data });
      })
      .catch(res => console.log(res.data));

    axios
      .get(`${apiurl}fetch-post-likes.php?post_id=${postid}&user_id=${user_id}`)
      .then(res => {
        console.log(res.data);
        this.setState({ likelist: res.data });
      })
      .catch(res => console.log(res.data));

    axios
      .get(
        `${apiurl}fetch-related-products.php?product_id=${productid}&user_id=${user_id}`,
      )
      .then(res => {
        console.warn(res.data);
        this.setState({ relatedproducts: res.data });
      })
      .catch(res => console.log('no data'));
  }

  componentDidUpdate() {
    console.log(this.state.relatedproducts);
  }

  openImage = image => {
    this.setState({
      images: [
        {
          url: `${imageurl}/${image}`,
          props: {},
        },
      ],
      imagePreview: true,
    });
  };

  openPhone = () => {
    const { productDetails } = this.state;
    const { details } = productDetails;
    var phoneNumber = "";
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${details.phone_1}`;
    } else {
      phoneNumber = `telprompt:${details.phone_1}`;
    }
    Linking.canOpenURL(phoneNumber).then((CanOpen) => {
      if (CanOpen) {
        Linking.openURL(phoneNumber)
      }
    })
  }

  render() {
    const { visible, productDetails, likelist, relatedproducts } = this.state;
    const { media, details } = productDetails;
    if (productDetails.length !== 0) {
      return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          {/* <Portal>
            <Modal visible={visible} onDismiss={() => this.setState({ visible: false })}>
              <View style={styles.modalStyle}>
                <View>
                  <Image
                    style={{ width: 88, height: 19 }}
                    resizeMode="contain"
                    source={require('../images/woodlig-logo-alt-image.png')}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#000000',
                      textAlign: 'center',
                      lineHeight: 20,
                      letterSpacing: -0.16
                    }}>
                    WARNING:
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Image
                      style={{ width: 73, height: 21 }}
                      resizeMode="contain"
                      source={require('../images/Woodlig_new_logo.png')}
                    />
                    <Text style={{ fontSize: 11, color: '#000000' }}>
                      shall not be held responsible for any inconvenience between you and the poster
                      of this product. Proceed wisely and with caution.
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}>
                  <TouchableOpacity onPress={() => this.setState({ visible: true })}>
                    <Image source={require('../images/Call.png')} />
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 36,
                      width: 2,
                      backgroundColor: '#dedede',
                      marginHorizontal: 12
                    }}
                  />
                  <TouchableOpacity onPress={() => this.setState({ visible: true })}>
                    <Image source={require('../images/message.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </Portal> */}
          <Modal
            onRequestClose={() => {
              this.setState({ imagePreview: false });
            }}
            visible={this.state.imagePreview}
            transparent={true}>
            <ImageViewer
              renderHeader={() => (
                <TouchableOpacity
                  onPress={() => this.setState({ imagePreview: false })}
                  style={{
                    top: 20,
                    left: 10,
                    alignSelf: 'flex-start',
                    position: 'absolute',
                    zIndex: 1111111,
                  }}>
                  <Icon size={30} color="#fff" name="close" />
                </TouchableOpacity>
              )}
              imageUrls={this.state.images}
            />
          </Modal>
          <SafeAreaView>
            <StatusBar
              translucent={false}
              backgroundColor="#ffffff"
              barStyle="dark-content"
            />
          </SafeAreaView>
          <ScrollView
            contentContainerstyle={{}}
            stickyHeaderIndices={[0]}
            scrollEnabled>
            <View style={styles.headerBg}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}>
                  <Customon name="long-arrow-left" size={15} color="#000" />
                </TouchableOpacity>
                {/*FontAwesome5 name="ellipsis-v" size={20} color="#000" />*/}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: 60,
                }}>
                <View>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 15,
                      fontFamily: 'Poppins-Medium',
                      lineHeight: 18,
                    }}>
                    {details.name.length > 20
                      ? `${details.name.substr(0, 20)}...`
                      : `${details.name}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Poppins-Medium',
                      letterSpacing: -0.24,
                      lineHeight: 18,
                      color: '#646464',
                    }}>
                    {details.product_type}
                  </Text>
                </View>
                <Text style={{ fontFamily: 'Poppins-Medium', color: '#646464' }}>
                  {moment(parseInt(`${details.date_created}`) * 1000).fromNow()}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: -100 }}>
              <Swiper style={{ height: 364, width, zIndex: -1 }}>
                {media.map((e, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.openImage(e.path);
                    }}>
                    <View key={index} style={{}}>
                      <Image
                        style={{
                          height: 364,
                          width,
                          borderBottomLeftRadius: 80,
                          overflow: 'hidden',
                        }}
                        source={{
                          uri: `${imageurl}/${e.path}`,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </Swiper>
            </View>
            <View style={{ height: 1000, backgroundColor: '#ffffff' }}>
              <View style={styles.cardBg}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}>
                  <View
                    style={{
                      borderColor: '#fb0201',
                      borderWidth: 1,
                      padding: 2,
                      borderRadius: 5,
                      paddingHorizontal: 5,
                    }}>
                    <Text style={{ color: '#fb0201', fontSize: 12 }}>
                      {details.purpose}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 15,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      NGN{numeral(details.price).format('0, 0')}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#dedede',
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}>
                    <PaperAvatar.Image
                      onPress={() => alert('pressed')}
                      source={
                        details.profile_thumb === ''
                          ? require('../images/Avatar_invisible_circle_1.png')
                          : { uri: `${imageurl}/${details.profile_thumb}` }
                      }
                    />
                    <View>
                      <Text>{details.full_name}</Text>
                      <Text>@{details.username}</Text>
                    </View>
                  </View>
                  <View style={{ alignSelf: 'center' }}>
                    <StarRating
                      disabled={false}
                      maxStars={5}
                      rating={parseInt(details.rating)}
                      starSize={12}
                      fullStarColor="red"
                      starStyle={{ width: 13 }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={this.openPhone}>
                    <Image source={require('../images/Call.png')} />
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 15,
                      width: 2,
                      backgroundColor: '#dedede',
                      marginHorizontal: 12,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("MessagingScreen",{theirid:details.created_by,user:details,productDetails:true})}>
                    <Image source={require('../images/message.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.cardBg}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#dedede',
                  }}>
                  <View>
                    <Text
                      style={{
                        color: '#808080',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                      }}>
                      Description
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <FontAwesome5
                      name="map-marker-alt"
                      color="#fb0201"
                      size={14}
                    />
                    <Text
                      style={{
                        color: '#808080',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 12,
                        marginLeft: 5,
                      }}>
                      {productDetails.details.formatted_address}
                    </Text>
                  </View>
                </View>
                <View style={{ paddingVertical: 10 }}>
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 15,
                    }}>
                    {productDetails.details.description}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBg}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#dedede',
                    paddingVertical: 10,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: '#000',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                      }}>
                      Liked by
                    </Text>
                  </View>
                  <LikeComponent />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {likelist.length === 0 ? (
                    <ActivityIndicator color="#000" size="large" />
                  ) : (
                      <View>
                        {likelist.status === 'empty' ? (
                          <Text>{likelist.message}</Text>
                        ) : (
                            <View style={{ flexDirection: 'row' }}>
                              {likelist.data.map(e => (
                                <TouchableOpacity key={e.user_id}>
                                  <PaperAvatar.Image
                                    onPress={() => alert('pressed')}
                                    source={
                                      e.profile_thumb === ''
                                        ? require('../images/Avatar_invisible_circle_1.png')
                                        : { uri: `${imageurl}/${e.profile_thumb}` }
                                    }
                                  />
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                      </View>
                    )}
                </View>
              </View>
              <View style={styles.cardBg}>
                <View
                  style={{
                    borderBottomColor: '#dedede',
                    borderBottomWidth: 1,
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 15,
                    }}>
                    Related
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {relatedproducts.status === 'success' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      {relatedproducts.data.map(e => (
                        <GalleryPosts data={e} />
                      ))}
                    </View>
                  ) : (
                      <Text
                        style={{
                          color: '#0000',
                          fontFamily: 'Poppins-Medium',
                          fontSize: 11,
                        }}>
                        No product
                    </Text>
                    )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerBg: {
    // width,
    // display: 'none',
    zIndex: 1,
    height: 116,
    paddingHorizontal: 25,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 0,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  cardBg: {
    width: width - 40,
    alignSelf: 'center',
    padding: 20,
    marginVertical: 10,
    // height: 168,
    elevation: 3,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    borderRadius: 40,
    backgroundColor: '#ffffff',
  },
  modalStyle: {
    width: 327,
    height: 245,
    alignSelf: 'center',
    justifyContent: 'space-around',
    // alignItems: 'center',
    paddingHorizontal: 30,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 0,
    backgroundColor: '#ffffff',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  activitystreamdata: state.activitystreamdata.activitystream,
});

export default connect(mapStateToProps)(ProductDetailsScreen);
