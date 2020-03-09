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
  Image,
  FlatList,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import HeaderComponent from '../components/HeaderComponent';
import WalletPromotion from '../components/WalletPromotion';
const moment = require('moment');
import {apiurl, localurl} from '../constants/config';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

export default class Wallet extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    //const profiledetails = navigation.getParam('profiledetails');
    const userId = navigation.getParam('userId');
    console.log('Data Receive :');
    //console.log(profiledetails);
    console.log('User ID : ', userId);

    this.state = {
      userId: userId,
      userBalance: 0,
      transactionData: [],
    };
    if (userId != undefined) {
      this.getWalletBalance();
      this.getTransactionHistory();
    }
  }

  onSelect = data => {
    // const { navigation } = this.props;
    // navigation.goBack();
    // navigation.state.params.onSelect();
    this.getWalletBalance();
    this.getTransactionHistory();
  };

  getWalletBalance() {
    fetch(apiurl + 'fetch-user-balance.php?user_id=' + this.state.userId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log('---------------------- DATA --------------------');
        console.log(responseJson);
        if (responseJson.status == 'success') {
          if (responseJson.user_balance != 'empty') {
            console.log(responseJson.user_balance[0].usd_balance);
            this.setState({
              userBalance: responseJson.user_balance[0].usd_balance,
            });
          } else {
            console.log('User Balance is Empty');
            this.setState({userBalance: 0});
          }
        }
        return responseJson.data;
      })
      .catch(error => {
        console.error(error);
        this.setState({userBalance: 0});
      });
  }

  getTransactionHistory() {
    fetch(
      apiurl + 'fetch-wallet-payment-history.php?user_id=' + this.state.userId,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log('---------------------- DATA --------------------');
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({
            transactionData: responseJson.data,
          });
        }
        return responseJson.data;
      })
      .catch(error => {
        console.error(error);
        this.setState({userBalance: 0});
      });
  }

  renderItemCustom(item) {
    var key = item.payment_date;
    var t = moment(key, 'YYYY-MM-DD HH:mm:ss');
    var date = moment(t).format('MMMM D, YYYY');
    var time = moment(t).format('HH:mm:ss');

    if (item.transfer_action == 'increase') {
      return (
        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <Image
            style={{width: 34, height: 34}}
            source={require('../images/dollar-sign-grey-hdpi.png')}
          />
          <View style={{flex: 1, flexDirection: 'column', marginLeft: 5}}>
            <TextView
              style={{color: '#57ceb3', fontWeight: 'bold'}}
              text={`+ $${item.amount}`}
            />
            <TextView
              style={{color: 'gray', fontSize: 10}}
              text={'Credit > Funding'}
            />
          </View>
          <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
            <TextView style={{color: 'gray', fontSize: 10}} text={date} />
            <TextView style={{color: 'gray', fontSize: 10}} text={time} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <Image
            style={{width: 34, height: 34}}
            source={require('../images/dollar-sign-grey-hdpi.png')}
          />
          <View style={{flex: 1, flexDirection: 'column', marginLeft: 5}}>
            <TextView
              style={{color: 'red', fontWeight: 'bold'}}
              text={`- $${item.amount}`}
            />
            <TextView
              style={{color: 'gray', fontSize: 10}}
              text={'Debit > Promotion'}
            />
          </View>
          <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
            <TextView style={{color: 'gray', fontSize: 10}} text={date} />
            <TextView style={{color: 'gray', fontSize: 10}} text={time} />
          </View>
        </View>
      );
    }
  }
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: 'gray',
          marginTop: 10,
          marginBottom: 10,
        }}
      />
    );
  };

  render() {
    const {navigation} = this.props;
    //const profiledetails = navigation.getParam('profiledetails');
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#ffffff"
          barStyle="dark-content"
          translucent={false}
        />
        <HeaderComponent title="My Wallet" />
        <ScrollView>
          <View style={styles.balance}>
            <View style={styles.balanceInner}>
              <TextView style={styles.textB} text={'Total Balance'} />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Image
                  style={{width: 30, height: 31}}
                  source={require('../images/Group1372.png')}
                />
                <Text
                  style={styles.textC}>{`${this.state.userBalance} USD`}</Text>
              </View>

              <View style={{justifyContent: 'center'}}>
                <View
                  style={{
                    marginTop: 10,
                    width: 166,
                    height: 2,
                    borderColor: '#f5f5f5',
                    borderStyle: 'solid',
                    borderWidth: 1,
                  }}
                />
                <View style={styles.infoC}>
                  <FontAwesome5 name="info-circle" size={14} />
                  <TouchableOpacity>
                    <TextView style={styles.textL} text={`Learn more`} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <ImageBackground
              style={styles.cardBg}
              source={require('../images/card-template.png')}>
              <View style={styles.cardInner}>
                <TextView style={styles.cardText} text={``} />

                <View
                  style={{
                    height: 98,
                    alignItems: 'flex-end',
                    marginRight: 20,
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('AddFunds', {
                        userId: this.state.userId,
                        onSelect: this.onSelect,
                      })
                    }>
                    <View style={styles.addFunds}>
                      <FontAwesome5
                        name="fingerprint"
                        color="#ffff"
                        size={14}
                      />
                      <TextView style={styles.addFundsBtn} text={`ADD FUNDS`} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.transactionText}>
            <TextView text={`Transaction History`} />
          </View>

          <View style={[styles.trasactionContainer, {flex: 1}]}>
            <FlatList
              data={this.state.transactionData}
              renderItem={({item}) => this.renderItemCustom(item)}
              ItemSeparatorComponent={this.FlatListItemSeparator}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  addFundsBtn: {
    fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    color: '#ffffff',
    // marginTop: 75,
    marginLeft: 8,
    fontSize: 10,
  },

  addFunds: {
    width: 99,
    height: 34,

    shadowOffset: {width: 0, height: 0},
    shadowColor: 'gray',
    shadowOpacity: 1,

    shadowRadius: 19,
    borderRadius: 25,
    backgroundColor: '#fb0201',
    elevation: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardBg: {},

  cardText: {
    fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    color: '#ffffff',
    marginTop: 75,
    marginLeft: 33,
    fontSize: 12,
  },
  infoC: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 30,
  },
  textL: {
    color: '#aeaeae',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: 9,
  },

  textB: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: 9,
  },
  textC: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: 20,
    // padding: 8,
  },
  transactionBodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  transactionText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },

  cardInner: {
    shadowColor: '#000',
    shadowOffset: {width: 12, height: 0},
    // shadowRadius: 19,
    // borderRadius: 13,
    // backgroundColor: 'red',
    // borderWidth: 2,
    // borderColor: '#000',
    width: 348,
    height: 218,
    elevation: 5,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  balance: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  balanceInner: {
    width: 209,
    height: 110,

    shadowOffset: {width: 0, height: 0},
    shadowColor: 'gray',
    shadowOpacity: 1,
    backgroundColor: '#FFF',

    shadowRadius: 6,
    borderRadius: 13,
    elevation: 5,
    padding: 8,

    // borderWidth: 2,
    // borderColor: '#000',
    // flex: 1,
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
  trasactionContainer: {
    margin: 20,
    padding: 20,
    shadowOffset: {width: 0, height: 0},
    shadowColor: 'gray',
    shadowOpacity: 1,
    backgroundColor: '#FFF',
    elevation: 20,
    borderRadius: 10,
  },
});
