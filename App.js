import React, {Component} from 'react';
import AppContainer from './src/navigators/MainNavigation';
import RNPaystack from 'react-native-paystack';
import base64 from 'react-native-base64';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AsyncStorage,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import firebase from 'react-native-firebase';
// import PayPal from 'react-native-paypal-wrapper';

export default class App extends Component {
  constructor() {
    super();
    console.log(
      '============================== Testing ==============================',
    );
    RNPaystack.init({
      publicKey: 'pk_test_d843094e5d98ad888990b7bdfa8a54b03b944983',
    });
    //this.makePayment();
  }

  getToken() {
    var token = base64.encode(
      'AcCcPJdsxZYWoeVp8xhw0LAdJrJNc75_UryaI2oWLibiUdn7iL-7H8U-JtUaVrzvcJLT2eB2GqpNtq5b:EE9n-ErIXvPpoAV5Le8Rk8s_9ebqRNeEM3U4RvcNzXXaZnB-3X0Gr5TeY1xNWDhCd_yJwEfKLONKvscw',
    );

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

        return responseJson;
      })
      .catch(error => {
        console.error(error.code);
      });
  }

  makePayment() {
    var data = {
      intent: 'sale',
      payer: {
        payment_method: 'credit_card',
        funding_instruments: [
          {
            credit_card: {
              number: '4710318234269490',
              type: 'visa',
              expire_month: 11,
              expire_year: 2024,
              cvv2: 123,
              first_name: 'Joe',
              last_name: 'Buyer',
            },
          },
        ],
      },
      transactions: [
        {
          amount: {
            total: '100.00',
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
        Authorization:
          'Bearer ' +
          'A21AAHcFqRMk8XvgDDXzyuVTrYKpDaqxl9Txhc2qATzXXJZpDCegCibb_bFVqz5PBBcCrU2R8zCUORpy_zTLa-HnKH_-aXqvg',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log('---------------------- DATA --------------------');
        console.log(responseJson);

        return responseJson;
      })
      .catch(error => {
        console.error(error.code);
      });
  }

  componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners(); //add this line
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log('------------- permission Enable');
      this.getToken();
    } else {
      this.requestPermission();
      console.log('-------------permission Disable');
    }
  }

  async createNotificationListeners() {
    console.log('-------------createNotificationListenersCalled');

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body} = notification;
        this.showAlert(title, body);
        console.log('-------------notificationListener', notificationListener);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification;
        this.showAlert(title, body);
        console.log(
          '-------------notificationOpenedListener',
          notificationOpen,
        );
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      this.showAlert(title, body);
      console.log('-------------notificationOpen', notificationOpen);
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log("('-------------", JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('------------- OK Pressed')}],
      {cancelable: false},
    );
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log('-------------fcmToken', fcmToken);
      } else {
        console.log('-------------fcmTokenTest', fcmToken);
      }
    } else {
      console.log('-------------fcmTokenAlready', fcmToken);
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      console.log('-------------permission Granted');
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('-------------permission rejected');
    }
  }

  render() {
    return <AppContainer />;
  }
}
