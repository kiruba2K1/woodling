import React from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import FindTalentsScreen from '../screens/FindTalentsScreen';
import ActivityStreamStack from './ActivityStreamStack';
import fontelloConfig from '../config.json';
import CastingCallsStack from './CastingCallsStack';
import MarketPlaceStack from './MarketPlaceStack';
import TrendingStack from './TrendingStack';
import FindTalentsStack from './FindTalentsStack';
var func = require('../components/getTranslated');
import language from "../constants/language.js"
const Customon = createIconSetFromFontello(fontelloConfig);
import TextView from '../components/TextView';

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  const IconComponent = Customon;
  let iconName;
  if (routeName === 'CastingCallsStack') {
    iconName = `casting-calls${focused ? '-selected' : '-unselected'}`;
  } else if (routeName === 'MarketPlace') {
    iconName = `marketplace${focused ? '-selected' : '-unselected'}`;
  } else if (routeName === 'FindTalentsStack') {
    iconName = `find-talents${focused ? '-selected' : '-unselected'}`;
  } else if (routeName === 'TrendingScreen') {
    iconName = `discovery${focused ? '-selected' : '-unselected'}`;
  } else if (routeName === 'ActivityStream') {
    iconName = `home${focused ? '-selected' : '-unselected'}`;
  }
  return <IconComponent name={iconName} size={27} color={tintColor} />;
};

const getTabBarLable = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let iconName;
  if (routeName === 'CastingCallsStack') {
    iconName = `Casting Call`;
  } else if (routeName === 'MarketPlace') {
    iconName = `Market Place`;
  } else if (routeName === 'FindTalentsStack') {
    iconName = `Find Talents`;
  } else if (routeName === 'TrendingScreen') {
    iconName = `Trending`;
  } else if (routeName === 'ActivityStream') {
    iconName = `Home`;
  }
  return <View style={{alignItems:'center',justifyContent:'center',marginLeft:2,marginRight:2}}><TextView style={{fontSize:10,fontWeight:'bold',fontFamily: 'Poppins-Medium',height:15}} text={iconName} /></View>;
};

const TabNavigator = createBottomTabNavigator(
  {
    ActivityStream: {
      screen: ActivityStreamStack,

    },
    TrendingScreen: {
      screen: TrendingStack,

    },
    CastingCallsStack: {
      screen: CastingCallsStack,

    },
    FindTalentsStack: {
      screen: FindTalentsStack,

    },
    MarketPlace: {
      screen: MarketPlaceStack,

    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => getTabBarIcon(navigation, focused, tintColor),
      tabBarLabel: ({ focused, tintColor }) => getTabBarLable(navigation, focused, tintColor),
    }),

    tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: 'black',
      showLabel: true,
      style: { paddingTop: 4 },
    },
    // initialRouteName: 'CastingCallsStack',
  },
);

// const TabNavigator = createAppContainer(BottomTab);

export default TabNavigator;
