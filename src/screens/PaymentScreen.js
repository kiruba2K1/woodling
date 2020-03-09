import React, {Component} from 'react';
import {
  Alert,
  TouchableOpacity,
  View,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  Image,
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import base64 from 'react-native-base64';
import RNPaystack from 'react-native-paystack';
import * as Progress from 'react-native-progress';

export default class Payment extends Component {
  constructor(props) {
    super(props);

    try {
      const {navigation} = this.props;
      const amount = navigation.getParam('amount', 'NO-ID');
      const user_id = navigation.getParam('userId', 'NO-ID');

      console.log('Receive : ' + amount);
      console.log('User_Id : ' + user_id);
      this.state = {
        amount: amount,
        userId: user_id,
        isLoading: false,
      };
    } catch (error) {
      console.log(error);
    }
  }

  getToken(gateway) {
    console.log(this.state.cardData);
    if (
      this.state.cardData != undefined &&
      this.state.cardData != {} &&
      this.state.cardData.valid
    ) {
      var expiry = this.state.cardData.values.expiry.split('/');

      console.log(this.state.cardData);

      var number = this.state.cardData.values.number;
      var exp_month = expiry[0];
      var exp_year = expiry[1];
      var cvc = this.state.cardData.values.cvc;
      var amount = parseInt(this.state.amount);
      var type = this.state.cardData.values.type;

      if (gateway == 'paypal') {
        this.getTokenPaypal(
          number.replace(/\s/g, ''),
          exp_month,
          exp_year,
          cvc,
          amount,
          type,
        );
      } else {
        this.makePaymentPayStack(
          number,
          exp_month,
          exp_year,
          cvc,
          amount * 100,
        );
      }
    } else if (
      this.state.cardData != undefined &&
      this.state.cardData != {} &&
      !this.state.cardData.valid
    ) {
      var cardStatus = this.state.cardData.status;
      if (cardStatus.number == 'incomplete') {
        this.showToast('Invalid card number');
      } else if (cardStatus.expiry == 'incomplete') {
        this.showToast('Invalid Expiry Date');
      } else if (cardStatus.cvc == 'incomplete') {
        this.showToast('Invalid CVC');
      } else if (cardStatus.name == 'incomplete') {
        this.showToast('Invalid Name');
      } else {
        this.showToast('Something went wrong, Please try again');
      }
    } else {
      this.showToast('Please fill the card details');
    }
  }

  getTokenPaypal(card_no, exp_month, exp_year, cvc, amount, type) {
    var token = base64.encode(
      'AcCcPJdsxZYWoeVp8xhw0LAdJrJNc75_UryaI2oWLibiUdn7iL-7H8U-JtUaVrzvcJLT2eB2GqpNtq5b:EE9n-ErIXvPpoAV5Le8Rk8s_9ebqRNeEM3U4RvcNzXXaZnB-3X0Gr5TeY1xNWDhCd_yJwEfKLONKvscw',
    );
    this.setState({isLoading: true});
    var details = {
      grant_type: 'client_credentials',
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + token,
      },
      body: formBody,
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log('---------------------- DATA --------------------');
        console.log(responseJson);
        if (responseJson.hasOwnProperty('access_token')) {
          this.makePaymentPaypal(
            responseJson.access_token,
            card_no,
            exp_month,
            exp_year,
            cvc,
            amount,
            type,
          );
        } else {
          this.setState({isLoading: false});
        }

        return responseJson;
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.log(error);
      });
  }

  makePaymentPaypal(
    access_token,
    card_no,
    exp_month,
    exp_year,
    cvc,
    amount,
    type,
  ) {
    console.log('access_token : ' + access_token);
    console.log('Card Number : ' + card_no);
    console.log('Exp Month : ' + exp_month);
    console.log('Exp Year : ' + exp_year);
    console.log('CVC : ' + cvc);
    console.log('Amount : ' + amount);
    console.log('type : ' + type);

    var data = {
      intent: 'sale',
      payer: {
        payment_method: 'credit_card',
        funding_instruments: [
          {
            credit_card: {
              number: card_no,
              type: type,
              expire_month: exp_month,
              expire_year: '20' + exp_year,
              cvv2: cvc,
              first_name: 'Joe',
              last_name: 'Buyer',
            },
          },
        ],
      },
      transactions: [
        {
          amount: {
            total: amount,
            currency: 'USD',
          },
          description: 'This is the payment transaction description.',
        },
      ],
    };

    fetch('https://api.sandbox.paypal.com/v1/payments/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log('---------------------- DATA --------------------');
        console.log(responseJson);

        if (
          responseJson.hasOwnProperty('state') &&
          responseJson.state == 'approved'
        ) {
          this.updateWalletBalance('paypal', responseJson.id);
          //  alert("Your payment is successful\n\nTransaction Id: " + responseJson.id);
        } else {
          this.setState({isLoading: false});
          alert('PayPal payment is Failed, Please Check the card details');
        }

        return responseJson;
      })
      .catch(error => {
        this.setState({isLoading: false});
        alert('Your payment is Failed, Please Check the card details');
        console.log(error);
      });
  }

  updateWalletBalance(method, token) {
    fetch(
      'http://woodlig.webbions.com/controllers/mobile/add-amount-in-wallet.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.userId,
          amount: this.state.amount,
          charge_token: token,
          payment_method: method,
        }),
      },
    )
      .then(response => {
        this.setState({isLoading: false});
        return response.json();
      })
      .then(responseJson => {
        console.log('---------------------- DATA --------------------');
        console.log(responseJson);

        if (
          responseJson.hasOwnProperty('status') &&
          responseJson.status == 'success'
        ) {
          Alert.alert(
            'Payment successful',
            'Your payment is successful, \nYour wallet balance is updated. \n\nTransaction Id: ' +
              token,
            [
              {
                text: 'Ok',
                onPress: () => {
                  const {navigation} = this.props;
                  navigation.goBack();
                  navigation.state.params.onSelect();
                },
              },
            ],
            {cancelable: false},
          );

          //alert("Your payment is successful, \nYour wallet balance is updated. \n\nTransaction Id: " + token);
        } else {
          this.setState({isLoading: false});
          alert('Your payment is Failed, \nPlease Check the card details');
        }

        return responseJson;
      })
      .catch(error => {
        this.setState({isLoading: false});
        alert('Your payment is Failed, Please Check the card details');
        console.log(error);
      });
  }

  makePaymentPayStack(card_no, exp_month, exp_year, cvc, amount) {
    console.log('Card Number : ' + card_no);
    console.log('Exp Month : ' + exp_month);
    console.log('Exp Year : ' + exp_year);
    console.log('CVC : ' + cvc);
    console.log('Amount : ' + amount);
    this.setState({isLoading: true});

    RNPaystack.chargeCard({
      cardNumber: card_no,
      expiryMonth: exp_month,
      expiryYear: exp_year,
      cvc: cvc,
      email: 'charge@master.dev',
      amountInKobo: amount,
    })
      .then(response => {
        console.log('========Sucess=======');
        this.updateWalletBalance('paystack', response.reference);

        //alert("PayStack payment is successful\n\n Reference Id : " + response.reference);
        console.log(response);
      })
      .catch(error => {
        console.log('========Error=======');
        alert('PayStack payment is Failed, Please Check the card details');
        //alert('Error')
        console.log(error); // error is a javascript Error object
        console.log(error.message);
        console.log(error.code);
        this.setState({isLoading: false});
      });
  }

  showToast(msg) {
    Toast.show(msg, {
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

  _getDate() {
    var d = moment(this.state.appointmentData.date).format('ddd Do MMMM, YYYY');
    return d;
  }

  _getTime() {
    var d = moment(this.state.appointmentData.time).format('hh:mm A');
    return d;
  }

  _onChange(data) {
    console.log(data);
    this.setState({cardData: data});
  }

  render() {
    return (
      <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
        {this.state.isLoading ? (
          <View
            style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
            <Text style={{fontSize: 17, marginBottom: 10, fontWeight: 'bold'}}>
              Payment in progress...
            </Text>
            <Text style={{fontSize: 12, marginBottom: 10}}>
              Do not press Back button
            </Text>

            <Progress.Circle size={60} indeterminate={true} />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <ScrollView style={{flex: 1, marginTop: 20, marginBottom: 20}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <CreditCardInput
                  requiresName
                  requiresCVC
                  validColor={'black'}
                  invalidColor={'red'}
                  placeholderColor={'darkgray'}
                  onFocus={this._onFocus}
                  onChange={data => this._onChange(data)}
                />
              </View>
            </ScrollView>

            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <TouchableOpacity
                style={[styles.addFunds2, {marginRight: 5}]}
                onPress={() => this.getToken('paypal')}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>PayPal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addFunds2, {marginLeft: 5}]}
                onPress={() => this.getToken('paystack')}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  PayStack
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addFunds2: {
    width: '40%',
    height: 34,
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
});
