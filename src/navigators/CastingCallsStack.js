import {createStackNavigator, NavigationActions} from 'react-navigation';
import React, {useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {Appbar, Portal, Dialog, Paragraph, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import ActivityStreamScreen from '../screens/ActivityStreamScreen';
import AddLocationRoute from '../screens/AddLocationScreen';
import TagPeopleScreen from '../screens/TagPeopleScreen';
import ProfileScreen from '../screens/ProfileScreen';

import ViewCastingCalls from '../components/ViewCastingCalls';
import {CastingCallsScreen} from '../screens/CastingCallsScreen';
import CastingCallDetail from '../screens/CastingCallDetail';
import AddCastingCalls from '../screens/AddCastingCalls';
import ViewApplicants from '../screens/ViewApplicants';
import FilterCastingCalls from '../screens/FilterCastingCalls';

import fontelloConfig from '../config.json';
import EditCastingCall from '../screens/EditCastingCall';
import CalendarAndList from '../screens/CalendarAndList';

import CastingCallPayments from '../screens/CastingCallPayments';
import Axios from 'axios';
import {apiurl} from '../constants/config';

export const EditDialog = props => {
  const {navigation} = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  deleteCall = async () => {
    setLoading(true);
    const {id} = navigation.state.params.casting_call_details.data[0];
    await Axios.post(`${apiurl}delete-casting-call.php?id=${id}`)
      .then(res => {
        if (res.data.status === 'success') {
          navigation.reset(
            [NavigationActions.navigate({routeName: 'CastingCallsScreen'})],
            0,
          );
        } else {
          alert(res.data.message);
        }
      })
      .catch(res => console.warn(res.data));
    setLoading(false);
  };
  return (
    <Portal>
      <StatusBar translucent={false} />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.navigation.goBack(null)} />
        <Appbar.Content title="Edit Casting Call" />
        <Appbar.Action
          icon={() => <Customon name="trash-alt" size={20} />}
          onPress={() => setVisible(true)}
        />
      </Appbar.Header>
      <Dialog
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}>
        <Dialog.Title>Are you sure you want to delete?</Dialog.Title>
        <Dialog.Content>
          <Paragraph>This will permanently delete this casting call</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            color="#000"
            mode="text"
            onPress={() => {
              setVisible(false);
            }}>
            Cancel
          </Button>
          {loading === false ? (
            <Button color="#000" mode="text" onPress={deleteCall}>
              Done
            </Button>
          ) : (
            <ActivityIndicator color="#fb0201" />
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

let visibility = false;
const Customon = createIconSetFromFontello(fontelloConfig);

const styles = StyleSheet.create({
  arrowback2: {
    color: '#fb0201',
  },
  header: {
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    height: 60,
    elevation: 5,
    backgroundColor: '#ffff',
    flexDirection: 'row',
    //  justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 15,

    shadowOffset: {width: 3, height: 0},
    elevation: 5,
  },
  cHeader: {
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    height: 60,
    //  justifyContent: 'space-between',
    // alignItems: 'center',
    // padding: 15,

    shadowOffset: {width: 3, height: 0},
    elevation: 5,
  },
  arrowback: {
    color: '#000',
    //flex:1
  },
  headerTitle: {
    // marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  headerArrow: {
    flex: 1,
  },
  title: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});

const {width} = Dimensions.get('window');
const CastingCallsStack = createStackNavigator(
  {
    CastingCallDetail: {
      screen: CastingCallDetail,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    CastingCallsScreen: {
      screen: CastingCallsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <SafeAreaView>
            <View
              style={{
                width,
                height: 50,
                backgroundColor: '#ffffff',
                // justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                elevation: 3,
              }}>
              <StatusBar
                backgroundColor="white"
                translucent={false}
                barStyle="dark-content"
              />
              <TouchableOpacity
                disabled
                onPress={() => navigation.navigate('FilterCastingCalls')}>
                <View style={{marginLeft: 10}}>
                  {/* <Customon name="filter" color="#fb0201" size={15} /> */}
                </View>
              </TouchableOpacity>

              <View style={{marginLeft: 30}}>
                <Customon name="woodlig-brand" color="#fb0201" />
              </View>

              <View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AddCastingCalls', {
                        menustatus: 'appliedjobs',
                      })
                    }>
                    <View style={{marginRight: 20, marginTop: 7}}>
                      <Customon name="paper-plane" color="#fb0201" size={14} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AddCastingCalls', {
                        menustatus: 'calendarview',
                      })
                    }>
                    <View style={{marginRight: 15}}>
                      <Customon
                        name="calendar-star"
                        color="#fb0201"
                        size={24}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        ),
      }),
    },
    AddCastingCalls: {
      screen: AddCastingCalls,
      navigationOptions: ({navigation}) => ({
        headerTitle: 'Casting Calls',
      }),
    },
    CalendarAndList: {
      screen: CalendarAndList,
      navigationOptions: {
        header: null,
      },
    },
    EditCastingCall: {
      screen: EditCastingCall,
      navigationOptions: navigation => ({
        header: <EditDialog {...navigation} />,
      }),
    },
    CastingCallPayments: {
      screen: CastingCallPayments,
      navigationOptions: {
        header: null,
      },
      // title: 'Casting Calls',
    },
    ViewApplicants: {
      screen: ViewApplicants,
      navigationOptions: ({navigation}) => ({
        header: (
          <SafeAreaView style={styles.cheader}>
            <View style={styles.header}>
              <View style={styles.headerArrow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Customon
                    style={styles.arrowback}
                    name="long-arrow-left"
                    size={15}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.headerTitle}>
                <Text style={styles.title}>Applicants</Text>
              </View>
              <View style={{flex: 1}} />
            </View>
          </SafeAreaView>
        ),
      }),
    },
    FilterCastingCalls: {
      screen: FilterCastingCalls,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    AddLocationRoute: {
      screen: AddLocationRoute,
    },
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
        // headerTransparent: true,
        // headerBackImage: (
        //   <Icon
        //     name="arrow-left"
        //     color="white"
        //     size={30}
        //     onPress={() => navigation.goBack()}
        //   />
        // ),
      }),
    },
    TagPeopleScreen: {
      screen: TagPeopleScreen,
      navigationOptions: ({navigation}) => ({
        headerBackImage: <Icon name="times" color="black" size={20} />,
        headerTitleContainerStyle: {justifyContent: 'center'},
        headerLayoutPreset: 'left',
        headerRight: (
          <Icon
            name="check"
            color="black"
            size={30}
            onPress={() => navigation.goBack()}
          />
        ),
        headerRightContainerStyle: {paddingRight: 10},
        title: 'Tag People',
      }),
    },
  },
  {
    initialRouteName: 'CastingCallsScreen',
  },
);

// const ActivityStreamStack = createAppContainer(BottomTab);

CastingCallsStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

export default CastingCallsStack;
