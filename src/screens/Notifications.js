import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  AsyncStorage,
} from 'react-native';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {Dropdown} from 'react-native-material-dropdown';
import NotificationProfileImage from '../components/notifications/NotificationProfileImage';
import NotificationStatus from '../components/notifications/NotificationStatus';
import NotificationImage from '../components/notifications/NotificationImage';
import NotificationHidden from '../components/notifications/NotificationHidden';
import NotificationFollow from '../components/notifications/NotificationFollow';
import NotificationRating from '../components/notifications/NotificationRating';
import NotificationApplication from '../components/notifications/NotificationApplication';
import NotificationLike from '../components/notifications/NotificationLike';
import NotificationPost from '../components/notifications/NotificationPost';
import fontelloConfig from '../config.json';
import {Switch} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {apiurl, imageurl} from '../constants/config';
import TextView from '../components/TextView';
const Customon = createIconSetFromFontello(fontelloConfig);
export default class Notifications extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const userId = navigation.getParam('userId');
    console.log('Data Receive :');
    console.log(userId);
    var isFrench = false;
    //alert(lan);

    this._retrieveData();
    this.state = {
      dataNotification: [],
      userId: userId,
      isFrench,
      isPremiumUser: false,
    };
    this.getNotifications(userId);
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if (value == 'fr') {
          this.setState({
            isFrench: true,
          });
        } else {
          this.setState({
            isFrench: false,
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

  getNotifications(userId) {
    try {
      fetch(apiurl + 'fetch-notifications.php?user_id=' + userId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          // console.log("Notification Data : ",response);
          // console.log("Notification Data1 : ",response._data);
          return response.json();
        })
        .then(responseJson => {
          console.log('---------------------- DATA --------------------');
          console.log(responseJson);
          console.log('IsPremium User : ' + responseJson.premium_user);

          if (responseJson.status == 'success') {
            if (responseJson.hasOwnProperty('notifications')) {
              this.setState({
                dataNotification: responseJson.notifications,
                isPremiumUser: responseJson.premium_user == 1,
              });
            } else {
              console.log('notification array not found');
            }
          } else {
            console.log('Status success not found');
          }
          return responseJson.data;
        })
        .catch(error => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  setFranch() {
    this.setState({isFrench: true});
  }

  setEnglish() {
    this.setState({isFrench: false});
  }

  render() {
    const {isFrench, isPremiumUser} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content"
          translucent={false}
        />
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
            <TextView style={styles.title} text="Notifications" />
          </View>
        </View>

        {
          // <View style={{flexDirection:'row',alignItems:'center',margin:5}}>
          //   <Text style={{color:'black'}}>Language  </Text>
          //
          //     <TouchableOpacity onPress={()=>this.setEnglish()} style={{flexDirection:'row',alignItems:'center'}}>
          //       <View  style={isFrench ? styles.languageDeSelected : styles.languageSelected}/>
          //       <Text style={{marginLeft:7}}>English</Text>
          //     </TouchableOpacity>
          //
          //     <TouchableOpacity onPress={()=>this.setFranch()} style={{flexDirection:'row',alignItems:'center'}}>
          //       <View  style={isFrench ? styles.languageSelected : styles.languageDeSelected}/>
          //       <Text style={{marginLeft:7}}>French</Text>
          //     </TouchableOpacity>
          //
          // </View>
        }

        <FlatList
          data={this.state.dataNotification}
          style={{marginTop: 10}}
          renderItem={({item, index}) => (
            <View style={styles.notification}>
              <View style={styles.wrapper}>
                <NotificationProfileImage
                  path={item.profile_picture}
                  date_created={item.date_created}
                />
                <NotificationStatus
                  name={item.heading}
                  description={
                    isFrench ? item.description_fr : item.description
                  }
                  type={item.type}
                  navigation={this.props.navigation}
                  userId={this.state.userId}
                  post_record={
                    item.post_record != undefined ? item.post_record : ''
                  }
                  profile_thumb={item.profile_thumb}
                  item={item}
                  isPremiumUser={isPremiumUser}
                />
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
  },
  notification: {
    width: Dimensions.get('window').width,
    borderWidth: 1,
    borderColor: '#eeeeee',
    paddingRight: 15,
    paddingLeft: 8,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
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
    justifyContent: 'center',
  },
  languageSelected: {
    marginLeft: 20,
    borderWidth: 1,
    borderColor: 'gray',
    height: 12,
    width: 12,
    backgroundColor: 'red',
  },
  languageDeSelected: {
    marginLeft: 20,
    borderWidth: 1,
    borderColor: 'gray',
    height: 12,
    width: 12,
  },
});
