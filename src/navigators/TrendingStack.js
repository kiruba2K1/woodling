import {createStackNavigator, NavigationActions} from 'react-navigation';
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TrendingScreen from '../screens/TrendingScreen';
import SearchEverythingScreen from '../screens/SearchEverythingScreen';
import SearchBar from './SearchTabBar';
import TrendingItems from './ViewTrendingItem';
import fontelloConfig from '../config.json';
import FinalPostDetails from '../screens/FinalPostDetails';
import SearchFilterScreen from '../screens/SearchFilterScreen';
import SearchCastingCalls from '../screens/SearchCastingCalls';
import SearchHeader from '../components/SearchHeader';
import MainSearchHeader from '../components/MainSearchHeader';
import SearchForPosts from '../screens/SearchForPosts';
import SearchForProducts from '../screens/SearchForProducts';
import SearchForServices from '../screens/SearchForServices';
import SearchForEvents from '../screens/SearchForEvents';
import SearchOnlyPeople from '../screens/SearchOnlyPeople';
import SearchAllPlaces from '../screens/SearchAllPlaces';
import SearchHashtagsScreen from '../screens/SearchHashtagsScreen';
import ViewTaggedPosts from '../screens/ViewTaggedPosts';
import TagHeader from '../components/TagHeader';
import CastingCallDetail from '../screens/CastingCallDetail';
import ExploreHashtags from '../screens/ExploreHashtags';

const Customon = createIconSetFromFontello(fontelloConfig);

const {width, height} = Dimensions.get('window');

const TrendingStack = createStackNavigator(
  {
    TrendingScreen: {
      screen: TrendingScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SearchScreen: {
      screen: SearchEverythingScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    SearchFilterScreen: {
      screen: SearchFilterScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <MainSearchHeader searchField={navigation.getParam('searchField')} />
        ),
      }),
    },
    SearchCastingCalls: {
      screen: SearchCastingCalls,
      navigationOptions: ({navigation}) => ({
        header: (
          <SearchHeader
            title={navigation.getParam('filterParam')}
            searchField={navigation.getParam('searchField')}
          />
        ),
      }),
    },
    SearchForPosts: {
      screen: SearchForPosts,
      navigationOptions: ({navigation}) => ({
        header: (
          <SearchHeader
            title={navigation.getParam('filterParam')}
            searchField={navigation.getParam('searchField')}
          />
        ),
      }),
    },
    SearchForProducts: {
      screen: SearchForProducts,
      navigationOptions: ({navigation}) => ({
        header: (
          <SearchHeader
            title={navigation.getParam('filterParam')}
            searchField={navigation.getParam('searchField')}
          />
        ),
      }),
    },
    SearchForServices: {
      screen: SearchForServices,
      navigationOptions: ({navigation}) => ({
        header: (
          <SearchHeader
            title={navigation.getParam('filterParam')}
            searchField={navigation.getParam('searchField')}
          />
        ),
      }),
    },
    SearchForEvents: {
      screen: SearchForEvents,
      navigationOptions: ({navigation}) => ({
        header: (
          <SearchHeader
            title={navigation.getParam('filterParam')}
            searchField={navigation.getParam('searchField')}
          />
        ),
      }),
    },
    SearchOnlyPeople: {
      screen: SearchOnlyPeople,
      navigationOptions: ({navigation}) => ({
        header: (
          <SearchHeader
            title={navigation.getParam('filterParam')}
            searchField={navigation.getParam('searchField')}
          />
        ),
      }),
    },
    SearchAllPlaces: {
      screen: SearchAllPlaces,
      navigationOptions: ({navigation}) => ({
        header: (
          <SearchHeader
            title={navigation.getParam('filterParam')}
            searchField={navigation.getParam('searchField')}
          />
        ),
      }),
    },
    ViewTaggedPosts: {
      screen: ViewTaggedPosts,
      navigationOptions: ({navigation}) => ({
        header: (
          <TagHeader
            item={navigation.getParam('item')}
            searchField={navigation.getParam('searchField')}
          />
        ),
      }),
    },
    SearchHashtagsScreen: {
      screen: SearchHashtagsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <SearchHeader
            title={navigation.getParam('filterParam')}
            searchField={navigation.getParam('searchField')}
          />
        ),
      }),
    },
    ExploreHashtags: {
      screen: ExploreHashtags,
    },
    PostDetails: {
      screen: FinalPostDetails,
      navigationOptions: {
        header: null,
      },
    },
    CastingCallDetail: {
      screen: CastingCallDetail,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ViewTrendingItems: {
      screen: TrendingItems,
      navigationOptions: ({navigation}) => ({
        header: (
          <View style={{height: 150}}>
            <StatusBar
              barStyle="light-content"
              backgroundColor="#fff"
              translucent={false}
            />
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
              }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Customon name="long-arrow-left" color="#000" size={15} />
              </TouchableOpacity>
              <FontAwesome5 name="ellipsis-v" color="#000" size={17} />
            </View>
            <View style={{flex: 5, alignItems: 'center'}}>
              {navigation.state.params.type === 'hashtags' && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../images/hashtags.png')}
                    style={{height: 88, width: 88}}
                  />
                  <Text>{navigation.state.params.item.title}</Text>
                </View>
              )}
              {navigation.state.params.type === 'places' && (
                <View style={{alignItems: 'center'}}>
                  <Image
                    source={require('../images/location.png')}
                    style={{height: 88, width: 88}}
                  />
                  <Text>{navigation.state.params.item.address}</Text>
                </View>
              )}
            </View>
          </View>
        ),
      }),
    },
    SearchTabBar: {
      screen: SearchBar,
      navigationOptions: ({navigation}) => ({
        header: (
          <View style={{height: 30, width}}>
            <StatusBar translucent={false} />
            <View
              style={{
                width: width - 40,
                paddingVertical: 10,
                borderRadius: 5,
                alignSelf: 'center',
                flexDirection: 'row',
                elevation: 2,
                backgroundColor: '#ffffff',
              }}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <FontAwesome5
                  name="times"
                  size={20}
                  color="#000"
                  onPress={() => navigation.goBack()}
                />
              </View>
              <View style={{flex: 6}}>
                <TouchableOpacity>
                  <TextInput
                    placeholder="search"
                    style={{padding: 0}}
                    value={navigation.state.params.searchField}
                    editable={false}
                    onChangeText={text => {
                      navigation.setParams({
                        searchField: text,
                      });
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <FontAwesome5 name="search" size={20} color="#000" />
              </View>
            </View>
          </View>
        ),
      }),
    },
  },
  {
    initialRouteName: 'TrendingScreen',
  },
);

// const ActivityStreamStack = createAppContainer(BottomTab);

TrendingStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

export default TrendingStack;
