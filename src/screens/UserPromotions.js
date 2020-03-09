import React, {Component, PureComponent} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import language from '../constants/language.js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import HeaderComponent from '../components/HeaderComponent';
import WalletPromotion from '../components/WalletPromotion';
const moment = require('moment');
import ActivityStream from '../components/ActivityStream';
import EmptyActivityStream from './EmptyActivityStream';
import {apiurl, localurl} from '../constants/config';

import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

export default class UserPromotions extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const profiledetails = navigation.getParam('profiledetails');
    const userId = navigation.getParam('userId');
    console.log('Data Receive :');
    console.log(userId);
    console.log(profiledetails);

    this.state = {
      userId: userId,
      userBalance: 0,
      promotionDataActive: [],
      promotionDataPause: [],
      promotionDataComplate: [],
      selectedIndex: 0,
      loading: true,
      selectedLanguage: 'fr',
    };
    this.getPromotionHistory(userId);
  }

  onSelect = data => {
    //alert("User promotion onSelect Called");
    this.getPromotionHistory(this.state.userId);
  };

  getPromotionHistory(userId) {
    fetch(apiurl + 'fetch-promotion.php?user_id=' + userId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        this.setState({loading: false});
        return response.json();
      })
      .then(responseJson => {
        console.log('---------------------- DATA --------------------');
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({
            promotionDataActive: responseJson.promotions.active,
            promotionDataPause: responseJson.promotions.paused,
            promotionDataComplate: responseJson.promotions.completed,
          });
        } else {
        }
        return responseJson.data;
      })
      .catch(error => {
        console.error(error);
      });
  }

  _getView() {
    const {selectedIndex} = this.state;
    // return this._active(selectedIndex);
    if (selectedIndex == 0) {
      return (
        <ItemList1
          listData={this.state.promotionDataActive}
          onSelect={this.onSelect}
        />
      );
    } else if (selectedIndex == 1) {
      return (
        <ItemList2
          listData={this.state.promotionDataPause}
          onSelect={this.onSelect}
        />
      );
    } else if (selectedIndex == 2) {
      return (
        <ItemList3
          listData={this.state.promotionDataComplate}
          onSelect={this.onSelect}
        />
      );
    }
  }

  _changeIndex(index) {
    const {selectedIndex} = this.state;

    if (selectedIndex == 0 && index == 2) {
      this.setState({selectedIndex: 1});
      setTimeout(() => {
        this.setState({selectedIndex: 2});
      }, 100);
    } else if (selectedIndex == 2 && index == 0) {
      this.setState({selectedIndex: 1});
      setTimeout(() => {
        this.setState({selectedIndex: 0});
      }, 100);
    } else {
      this.setState({selectedIndex: index});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#ffffff"
          barStyle="dark-content"
          translucent={false}
        />
        <HeaderComponent title="Promotions" size={40} />
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            width: '100%',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => this._changeIndex(0)}
            style={
              this.state.selectedIndex == 0
                ? styles.selected
                : styles.deselected
            }>
            <TextView
              style={
                this.state.selectedIndex == 0
                  ? styles.selectedText
                  : styles.deselectedText
              }
              text="Active"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this._changeIndex(1)}
            style={
              this.state.selectedIndex == 1
                ? styles.selected
                : styles.deselected
            }>
            <TextView
              style={
                this.state.selectedIndex == 1
                  ? styles.selectedText
                  : styles.deselectedText
              }
              text="Pause"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this._changeIndex(2)}
            style={
              this.state.selectedIndex == 2
                ? styles.selected
                : styles.deselected
            }>
            <TextView
              text="Completed"
              style={
                this.state.selectedIndex == 2
                  ? styles.selectedText
                  : styles.deselectedText
              }
            />
          </TouchableOpacity>
        </View>
        {this._getView()}
      </View>
    );
  }
}

class ItemList1 extends PureComponent {
  render() {
    const activeItem = {};
    const {listData, onSelect, index} = this.props;
    return (
      <View style={{backgroundColor: '#eeeeee', flex: 1}}>
        {listData.length > 0 ? (
          <FlatList
            style={{flex: 1}}
            data={listData}
            keyExtractor={item => item.post_id}
            renderItem={({item}) => (
              <ActivityStream
                full_name={item.full_name}
                username={item.username}
                text={item.body}
                type={item.type}
                address={item.address}
                path={item.path}
                event_type={item.event_type}
                likes={item.likes}
                like_status={item.like_status}
                comments={item.comments}
                profile_thumb={item.profile_thumb}
                theirid={item.post_user_id}
                caption={item.caption}
                postid={item.post_id}
                datecreated={item.date_created}
                likestatus={item.like_status}
                productname={item.product_name}
                productpurpose={item.product_purpose}
                productprice={item.product_price}
                producttype={null}
                productid={item.product_id}
                activeItem={activeItem}
                Item={item}
                Refresh={null}
                insights={true}
                onSelect={onSelect}
              />
            )}
          />
        ) : (
          <Text
            style={{textAlign: 'center', alignItems: 'center', marginTop: 25}}>
            No Active Promotion
          </Text>
        )}
      </View>
    );
  }
}

class ItemList2 extends PureComponent {
  render() {
    const activeItem = {};
    const {listData, onSelect, index} = this.props;
    return (
      <View style={{backgroundColor: '#eeeeee', flex: 1}}>
        {listData.length > 0 ? (
          <FlatList
            style={{flex: 1}}
            data={listData}
            keyExtractor={item => item.post_id}
            renderItem={({item}) => (
              <ActivityStream
                full_name={item.full_name}
                username={item.username}
                text={item.body}
                type={item.type}
                address={item.address}
                path={item.path}
                event_type={item.event_type}
                likes={item.likes}
                like_status={item.like_status}
                comments={item.comments}
                profile_thumb={item.profile_thumb}
                theirid={item.post_user_id}
                caption={item.caption}
                postid={item.post_id}
                datecreated={item.date_created}
                likestatus={item.like_status}
                productname={item.product_name}
                productpurpose={item.product_purpose}
                productprice={item.product_price}
                producttype={null}
                productid={item.product_id}
                activeItem={activeItem}
                Item={item}
                Refresh={null}
                insights={true}
                onSelect={onSelect}
              />
            )}
          />
        ) : (
          <Text
            style={{textAlign: 'center', alignItems: 'center', marginTop: 25}}>
            No Paused Promotion
          </Text>
        )}
      </View>
    );
  }
}

class ItemList3 extends PureComponent {
  render() {
    const activeItem = {};
    const {listData, onSelect, index} = this.props;
    return (
      <View style={{backgroundColor: '#eeeeee', flex: 1}}>
        {listData.length > 0 ? (
          <FlatList
            style={{flex: 1}}
            data={listData}
            keyExtractor={item => item.post_id}
            renderItem={({item}) => (
              <ActivityStream
                full_name={item.full_name}
                username={item.username}
                text={item.body}
                type={item.type}
                address={item.address}
                path={item.path}
                event_type={item.event_type}
                likes={item.likes}
                like_status={item.like_status}
                comments={item.comments}
                profile_thumb={item.profile_thumb}
                theirid={item.post_user_id}
                caption={item.caption}
                postid={item.post_id}
                datecreated={item.date_created}
                likestatus={item.like_status}
                productname={item.product_name}
                productpurpose={item.product_purpose}
                productprice={item.product_price}
                producttype={null}
                productid={item.product_id}
                activeItem={activeItem}
                Item={item}
                Refresh={null}
                insights={true}
                onSelect={onSelect}
              />
            )}
          />
        ) : (
          <Text
            style={{textAlign: 'center', alignItems: 'center', marginTop: 25}}>
            No Completed Promotion
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deselectedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
  },
  selectedText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
  },
  deselected: {
    flex: 1,
  },
  selected: {
    flex: 1,
    borderBottomWidth: 3,
    borderBottomColor: 'red',
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
