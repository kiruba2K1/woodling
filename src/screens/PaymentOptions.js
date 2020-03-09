/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import fontelloConfig from '../config.json';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const Customon = createIconSetFromFontello(fontelloConfig);
import {createIconSetFromFontello} from 'react-native-vector-icons';
import WalletPromotion from '../components/WalletPromotion';
import Axios from 'axios';
import {apiurl, localurl} from '../constants/config';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import RNPaystack from 'react-native-paystack';
import {TextInput, ActivityIndicator} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import {requestOneTimePayment} from 'react-native-paypal';
import TextView from '../components/TextView';

class PaymentOptions extends Component {
  state = {
    Cardnum: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    otp: '',
    pin: '',
    PaystackModal: false,
    loading: false,
  };

  componentDidMount() {
    RNPaystack.init({
      publicKey: 'pk_test_2cc6701be334f869e59d88e86f6e0677c674bc2d',
    });
  }

  Payment = (user_id, plan, amount, payment, token) => {
    this.setState({loading: true});
    Axios.get(
      `${apiurl}subscribe-to-premium.php?user_id=${user_id}&premium_plan=${plan}&amount_paid=${amount}&payment_used=${payment}&authorization_code=${token}`,
    )
      .then(res => {
        this.setState({loading: false});
        if (res.data.status == 'success') {
          this.props.navigation.state.params.data.Refresh();
          this.props.navigation.goBack('Pre');
          this.setState({PaystackModal: false});
          Toast.show('Payment Successful', {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
        } else {
          Toast.show(res.data.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
        }
      })
      .catch(err => {
        this.setState({loading: false});
        Toast.show(err, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        });
      });
  };

  CompletePaypal = (user_id, plan, amount, payment, token, payerId) => {
    this.setState({loading: true});
    var description =
      plan == 'yearly'
        ? 'Woodlig Hub yearly subscription'
        : 'Woodlig Hub monthly subscription';
    Axios.get(
      `${apiurl}complete-paypal-payment.php?amount=${amount}&payment_method_nonce=${token}&description=${description}`,
    )
      .then(res => {
        this.setState({loading: false});
        if (res.data.status == 'success') {
          this.Payment(user_id, plan, amount, payment, token);
        } else {
          Toast.show(res.data, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
        }
      })
      .catch(err => {
        this.setState({loading: false});
        Toast.show('Error ' + err.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        });
      });
  };

  VerifyPayStack = (user_id, plan, amount, payment, token) => {
    this.setState({loading: true});
    Axios.get(`${apiurl}verify-payment.php?reference=${token}`)
      .then(res => {
        console.warn(token, res);
        this.setState({loading: false});
        if (res.data.status == 'success') {
          this.Payment(user_id, plan, amount, payment, token);
        } else {
          Toast.show(res.data, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
        }
      })
      .catch(err => {
        this.setState({loading: false});
        Toast.show('Error ' + err.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        });
      });
  };

  onPaymentPaypal = async () => {
    this.setState({loading: true});
    const {data} = this.props.navigation.state.params.data.data;
    const {prices} = this.props.navigation.state.params.data;
    const subType = this.props.navigation.state.params.sub;
    var amount = subType == 'yearly' ? prices[1].price : prices[0].price;
    var token = 'sandbox_zjnvps83_tppvxcyz39pd62jc';
    //   const {
    //     nonce,
    //     payerId,
    //     email,
    //     firstName,
    //     lastName,
    //     phone
    // } = await

    requestOneTimePayment(token, {
      amount: amount, // required
      currency: 'USD',
      localeCode: 'en_GB',
      shippingAddressRequired: false,
      userAction: 'commit',
      intent: 'sale',
      merchantAccountId: 'woodligtechnologyhub',
    })
      .then(value => {
        const {nonce, payerId, email, firstName, lastName, phone} = value;
        this.setState({loading: false});
        this.CompletePaypal(
          this.props.user_id,
          subType,
          amount,
          'paypal',
          nonce,
          payerId,
        );
      })
      .catch(error => {
        this.setState({loading: false});
      });
  };

  onPaymentPaystack = async () => {
    this.setState({loading: true});
    const {data} = this.props.navigation.state.params.data.data;
    const {prices} = this.props.navigation.state.params.data;
    const subType = this.props.navigation.state.params.sub;
    var amount = subType == 'yearly' ? prices[1].price : prices[0].price;

    const options = {
      cardNumber: this.state.Cardnum,
      expiryMonth: this.state.expiryMonth,
      expiryYear: this.state.expiryYear,
      cvc: this.state.cvc,
      email: data.email,
      amountInKobo: parseInt(amount) * 100,
    };

    RNPaystack.chargeCard(options)
      .then(token => {
        this.VerifyPayStack(
          this.props.user_id,
          subType,
          amount,
          'paystack',
          token.reference,
        );
      })
      .catch(e => {
        this.setState({loading: false});
        Toast.show(e.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content"
          translucent={false}
        />
        <SafeAreaView>
          <View style={styles.header}>
            <View style={styles.headerArrow}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Customon
                  style={styles.arrowback}
                  name="long-arrow-left"
                  size={15}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.headerTitle}>
              <TextView style={styles.title} text="Payment Methods" />
            </View>
          </View>
        </SafeAreaView>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ImageBackground
            source={require('../images/paystack.png')}
            style={{
              width: 376,
              height: 145,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({PaystackModal: true});
              }}>
              <View
                style={{
                  borderRadius: 25,
                  paddingRight: 25,
                  paddingTop: 10,
                  paddingLeft: 25,
                  paddingBottom: 10,
                  shadowColor: 'black',
                  elevation: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  height: 40,
                  width: 220,
                }}>
                <TextView style={styles.title2} text="Continue with" />
                <Image
                  source={require('../images/paystack2.png')}
                  style={{width: 81, height: 21}}
                />
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{borderWidth: 1, borderColor: '#e7e4e9', width: 376}}></View>
        </View>

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ImageBackground
            source={require('../images/paypal.png')}
            style={{
              width: 376,
              height: 145,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.onPaymentPaypal();
              }}>
              <View
                style={{
                  borderRadius: 25,
                  paddingRight: 25,
                  paddingTop: 10,
                  paddingLeft: 25,
                  paddingBottom: 10,
                  shadowColor: 'black',
                  elevation: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  height: 40,
                  width: 220,
                }}>
                <TextView style={styles.title2} text="Continue with" />
                <Image
                  source={require('../images/paypal-2.png')}
                  style={{width: 55, height: 24}}
                />
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <Modal animationType="fade" transparent visible={this.state.loading}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: '#000',
                opacity: 0.4,
              }}
            />
            <ActivityIndicator size={50} color="orange" />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent
          visible={this.state.PaystackModal}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: '#000',
                opacity: 0.4,
              }}
            />
            <KeyboardAvoidingView
              style={{
                backgroundColor: '#fff',
                height: 500,
                width: '95%',
                padding: 20,
                borderRadius: 5,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this.setState({PaystackModal: false})}
                style={{
                  top: 5,
                  left: 5,
                  alignSelf: 'flex-start',
                  position: 'absolute',
                  zIndex: 1111111,
                }}>
                <Icon size={30} color="#000" name="close" />
              </TouchableOpacity>
              <Image
                source={require('../images/paystack2.png')}
                resizeMode="stretch"
                style={{
                  width: 100,
                  height: 30,
                  alignSelf: 'center',
                  marginBottom: 10,
                }}
              />
              <TextInput
                keyboardType="number-pad"
                onChangeText={text => {
                  this.setState({Cardnum: text});
                }}
                placeholder="Card Number"
              />
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <TextInput
                  keyboardType="number-pad"
                  onChangeText={text => {
                    this.setState({expiryMonth: text});
                  }}
                  style={{flex: 1}}
                  placeholder="MM"
                />
                <TextInput
                  keyboardType="number-pad"
                  onChangeText={text => {
                    this.setState({expiryYear: text});
                  }}
                  style={{flex: 1}}
                  placeholder="YY"
                />
              </View>
              <TextInput
                keyboardType="number-pad"
                onChangeText={text => {
                  this.setState({cvc: text});
                }}
                style={{marginBottom: 20}}
                placeholder="CVC"
              />
              {/* <TextInput
              keyboardType="number-pad"
               onChangeText={(text) => {
                this.setState({ pin: text })
              }} style={{ marginBottom: 20 }} placeholder="PIN" />
              <TextInput
              keyboardType="number-pad"
               onChangeText={(text) => {
                this.setState({ otp: text })
              }} style={{ marginBottom: 20 }} placeholder="OTP" /> */}
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => {
                  if (
                    this.state.Cardnum &&
                    this.state.expiryMonth &&
                    this.state.cvc &&
                    this.state.expiryYear
                  ) {
                    this.onPaymentPaystack();
                  } else {
                    alert('Please fill all fields');
                  }
                }}>
                <View
                  style={{
                    borderRadius: 25,
                    paddingRight: 25,
                    paddingTop: 10,
                    paddingLeft: 25,
                    paddingBottom: 10,
                    shadowColor: 'black',
                    elevation: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    height: 40,
                    width: 220,
                  }}>
                  <TextView style={styles.title2} text="Continue with" />
                  <Image
                    source={require('../images/paystack2.png')}
                    style={{width: 81, height: 21}}
                  />
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
});

export default connect(mapStateToProps, null)(PaymentOptions);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    //  justifyContent: 'space-between',
    // alignItems: 'center',
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
  title2: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    paddingRight: 10,
  },
  arrowback: {
    color: '#000',
  },

  headerArrow: {
    flex: 1,
  },

  headerTitle: {
    flex: 2,
    // marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center',
  },
});
