import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  AsyncStorage,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import WalletPromotion from '../components/WalletPromotion';
import RNPaystack from 'react-native-paystack';
import Toast from 'react-native-root-toast';
import TextView from '../components/TextView';
import language from '../constants/language.js';
const Customon = createIconSetFromFontello(fontelloConfig);

export default class AddFunds extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const user_id = navigation.getParam('userId', 'NO-ID');
    this._retrieveData();
    console.log('UserId : ' + user_id);
    this.state = {
      amt: '0',
      userId: user_id,
      isFrench: 'en',
    };
  }
  onSelect = data => {
    const {navigation} = this.props;
    navigation.goBack();
    navigation.state.params.onSelect();
  };
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if (value == 'fr') {
          this.setState({
            isFrench: 'fr',
          });
        } else {
          this.setState({
            isFrench: 'en',
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
  // onPress = () => {
  //   this.props.navigate("ViewB", { onSelect: this.onSelect });
  // };

  makePayment(navigation) {
    if (this.state.amt == '0' || this.state.amt == '') {
      Toast.show('Please enter the amount !', {
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
      console.log('Send : ' + this.state.amt);
      //navigation.navigate("PaymentScreen",{amount:this.state.amt,userId: this.state.userId,onSelect: this.onSelect});
      navigation.navigate('PaymentOptionsWallet', {
        amount: this.state.amt,
        userId: this.state.userId,
        onSelect: this.onSelect,
      });
    }
  }

  // chargeCard() {
  //   	RNPaystack.chargeCard({
  //         cardNumber: '4084084084084081',
  //         expiryMonth: '12',
  //         expiryYear: '19',
  //         cvc: '408',
  //         email: 'chargeIOS@master.dev',
  //         amountInKobo: 150000
  //       })
  //   	.then(response => {
  //   	  console.log("========Sucess======="); // card charged successfully, get reference here
  //       alert(JSON.stringify(response))
  //   	  console.log(response); // card charged successfully, get reference here
  //   	})
  //   	.catch(error => {
  //       console.log("========Error=======");
  //       alert('Error')
  //   	  console.log(error); // error is a javascript Error object
  //   	  console.log(error.message);
  //   	  console.log(error.code);
  //   	})
  //   }
  // getAmount(amount){
  //   console.log(amount);
  //
  // }

  render() {
    const {isFrench} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Customon
              style={styles.arrowback}
              name="long-arrow-left"
              size={15}
            />
          </TouchableOpacity>
          <TextView style={styles.title} text="Add Funds"></TextView>
          <TouchableOpacity>
            <Image
              style={{width: 38, height: 38}}
              source={require('../images/ic_account_circle_red_24px.jpg')}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <View
            style={{
              justifyContent: 'center',
              paddingLeft: 10,
              height: 50,
              borderWidth: 1,
              borderRadius: 10,
              margin: 10,
              width: '95%',
              borderColor: '#777',
            }}>
            <TextInput
              placeholder={language.promotions.add_funds(isFrench)}
              underlineColorAndroid="transparent"
              keyboardType="numeric"
              style={{color: 'black'}}
              onChangeText={amount => this.setState({amt: amount})}
            />
          </View>
        </View>
        <View style={{alignItems: 'flex-end', marginRight: 20}}>
          <TouchableOpacity
            onPress={() => this.makePayment(this.props.navigation)}>
            <View style={styles.addFunds2}>
              <FontAwesome5 name="fingerprint" color="#ffff" size={14} />
              <TextView style={styles.addFundsBtn} text="ADD FUNDS"></TextView>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  arrowback: {
    color: '#000',
  },

  headerArrow: {
    flex: 1,
  },

  headerTitle: {
    flex: 2,
    marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  addFunds: {
    width: 362,
    height: 40,
    borderRadius: 5,
    borderColor: '#d6d6d6',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#f5f5f5',
  },

  addFundsBtn: {
    fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    color: '#ffffff',
    // marginTop: 75,
    marginLeft: 8,
    fontSize: 10,
  },

  addFunds2: {
    width: 99,
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
  textInputStyle: {
    color: 'black',
  },
});
