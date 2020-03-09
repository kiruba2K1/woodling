import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ImageBackground,
  SafeAreaView,
  TouchableHighlight,
  Image,
  Modal,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import WalletPromotion from '../components/WalletPromotion';
import Axios from 'axios';
import {apiurl, localurl} from '../constants/config';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import RNPaystack from 'react-native-paystack';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

class PremiumMembership extends Component {
  state = {
    subType: 'yearly',
    payment: false,
  };

  // componentWillMount(){
  //   Axios.get(`${apiurl}fetch-premium-pricing.php`).then((res)=>{
  //     if(res.data.status=="success")
  //     {
  //       this.setState({prePrice:res.data.premium_pricing})
  //     }
  //     else
  //     {
  //       alert(res.data.message)
  //     }
  //   }).catch((err)=>{
  //     alert(err.message)
  //   })
  // }

  render() {
    const {subType} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#ffff"
          translucent={false}
          barStyle="dark-content"
        />
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity>
              <Customon
                name="x"
                color="#000"
                size={14}
                onPress={() => this.props.navigation.goBack()}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View style={styles.headerTitle3}>
          <TextView style={styles.title} text='Premium Membership' />
        </View>
        <ImageBackground
          source={require('../images/premium_member_bg.webp')}
          style={{flex: 1}}
          resizeMode="contain">
          <View style={styles.containerStyle}>
            <TouchableOpacity
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 0},
                shadowRadius: 6,
                elevation: 2,
                borderWidth: subType === 'yearly' ? 3 : 0,
                borderColor: subType === 'yearly' ? '#fb0201' : '#fff',
              }}
              onPress={() => this.setState({subType: 'yearly'})}>
              <View style={styles.yearlyMembership}>
                <View style={{padding: 8}}>
                  <TextView style={styles.title} text='Yearly' />
                </View>
                <View
                  style={{
                    borderBottomColor: '#fb0201',
                    borderWidth: 1,
                    width: 165,
                    marginBottom: 10,
                  }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='Get featured on discovery' />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='Premium search results' />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='Keep notes on talents' />

                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='Be notified when a casting call is available' />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='See who visited your profile' />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='Full access' />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="red" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={[styles.innerText, styles.bottom]} text='5 free casting calls' />
                  </View>
                </View>

                <View
                  style={[
                    styles.paymentCurve,
                    {
                      borderColor: subType === 'yearly' ? '#fb0201' : '#fff',
                      borderTopWidth: subType === 'yearly' ? 3 : 0,
                      borderLeftWidth: subType === 'yearly' ? 3 : 0,
                      borderRightWidth: subType === 'yearly' ? 3 : 0,
                    },
                  ]}>
                  <Text style={styles.paymentText} numberOfLines={1}>
                    $ 2.90 USD/month
                  </Text>
                  <Text style={styles.paymentText2}>$35 USD</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 0},
                shadowRadius: 6,
                elevation: 2,
                borderWidth: subType === 'monthly' ? 3 : 0,
                borderColor: subType === 'monthly' ? '#fb0201' : '#fff',
              }}
              onPress={() => this.setState({subType: 'monthly'})}>
              <View style={styles.yearlyMembership}>
                <View style={{padding: 8}}>
                  <TextView style={styles.title} text='Monthly' />
                </View>
                <View
                  style={{
                    borderBottomColor: '#fb0201',
                    borderWidth: 1,
                    width: 165,
                    marginBottom: 10,
                  }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='Get featured on discovery' />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='Premium search results' />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='Keep notes on talents' />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='Be notified when a casting is available' />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={styles.innerText} text='See who visited your profile' />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 13,
                    paddingTop: 8,
                  }}>
                  <View style={styles.inner}>
                    <Customon name="check" color="#fb0201" size={14} />
                  </View>
                  <View style={styles.inner2}>
                    <TextView style={[styles.innerText, styles.bottom2]} text='Full access' />
                  </View>
                </View>

                <TouchableOpacity>
                  <View
                    style={[
                      styles.paymentCurve,
                      styles.paymentCurve,
                      {
                        borderColor: subType === 'monthly' ? '#fb0201' : '#fff',
                        borderTopWidth: subType === 'monthly' ? 3 : 0,
                        borderLeftWidth: subType === 'monthly' ? 3 : 0,
                        borderRightWidth: subType === 'monthly' ? 3 : 0,
                      },
                    ]}>
                    <Text style={styles.paymentText} numberOfLines={1}>
                      $5.00 USD/month
                    </Text>
                    <Text style={styles.paymentText2}>$60 USD</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 0.2,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('PaymentMethods', {
                sub: subType,
                data: this.props.navigation.state.params,
              });
            }}>
            <View style={styles.addFunds2}>
              <FontAwesome5 name="fingerprint" color="#ffff" size={25} />
              <TextView style={styles.addFundsBtn} text='Proceed' />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
});

export default connect(
  mapStateToProps,
  null,
)(PremiumMembership);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bottom: {
    marginBottom: 69,
  },

  bottom2: {
    marginBottom: 93,
  },
  paymentText: {
    color: '#707070',
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
  },
  paymentText2: {
    color: '#0ce0b5',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  paymentCurve: {
    width: 111,
    height: 70,
    shadowColor: '#000',
    // shadowOffset: { width: -2, height: 0 },
    shadowRadius: 4,

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#ffffff',
    elevation: 5,
    paddingTop: 15,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inner2: {
    // flexDirection: 'row',
    // padding: 8,
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },

  innerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    color: '#000',
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 8
  },

  addFunds2: {
    width: 156,
    height: 40,
    shadowColor: '#000',
    // shadowOffset: { width: 6, height: 0 },
    shadowRadius: 19,
    borderRadius: 25,
    backgroundColor: '#fb0201',
    elevation: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addFundsBtn: {
    fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    color: '#ffffff',
    // marginTop: 75,
    marginLeft: 8,
    fontSize: 15,
  },

  containerStyle: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-around',
    marginTop: 20,
  },

  yearlyMembership: {
    width: 165,
    height: 341,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    opacity: 0.84,
    // justifyContent: 'center',
    alignItems: 'center',

    // borderColor: '#f5f5f5',
  },
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: {width: 3, height: 0},
    // elevation: 5,
  },

  title: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },

  arrowback: {
    color: '#000',
  },

  headerArrow: {
    flex: 1,
  },

  headerTitle: {
    // flex: 2,
    // marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle3: {
    backgroundColor: '#ffff',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
