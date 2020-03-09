import {createStackNavigator} from 'react-navigation';
import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ActivityStreamScreen from '../screens/ActivityStreamScreen';
import NewPostScreen from '../screens/NewPostScreen';
import OnYourMindScreen from '../screens/OnYourMindScreen';
import AddLocationRoute from '../screens/AddLocationScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import MarketPlaceScreen from '../screens/MarketPlaceScreen';
import fontelloConfig from '../config.json';
import FilterMarketPlace from '../screens/FilterMarketPlace';
import MarketplaceFavourited from '../screens/MarketplaceFavourited';

const Customon = createIconSetFromFontello(fontelloConfig);

const {width} = Dimensions.get('window');

const MarketPlaceStack = createStackNavigator(
  {
    MarketPlace: {
      screen: MarketPlaceScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <SafeAreaView>
            <View style={styles.header}>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  disabled
                  onPress={() => navigation.navigate('FilterMarketPlace')}>
                  {/* <Customon name="filter" color="#fb0201" size={15} /> */}
                </TouchableOpacity>
              </View>

              <View style={{flex: 1, alignItems: 'center'}}>
                <Customon name="woodlig-brand" color="#fb0201" />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('MarketPlaceFavorited', {
                      status: 'favorited',
                    })
                  }>
                  <Customon
                    style={{paddingRight: 20}}
                    name="like-icon"
                    size={15}
                    color="#fb0201"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('MarketPlaceFavorited', {
                      status: 'posted',
                    })
                  }>
                  <Customon name="file-upload" size={15} color="#fb0201" />
                </TouchableOpacity>
                {/*<Customon name="search" size={15} color="#fb0201" />*/}
              </View>
            </View>
          </SafeAreaView>
        ),
      }),
    },
    MarketPlaceFavorited: {
      screen: MarketplaceFavourited,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ProductDetails: {
      screen: ProductDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    FilterMarketPlace: {
      screen: FilterMarketPlace,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
  },
  {
    initialRouteName: 'MarketPlace',
  },
);

// const ActivityStreamStack = createAppContainer(BottomTab);

// MarketPlaceStack.navigationOptions = ({ navigation }) => {
//   let tabBarVisible = true;
//   if (navigation.state.routeName === 'FilterMarketPlace') {
//     return (tabBarVisible = false);
//   }

//   return {
//     tabBarVisible
//   };
// };

export default MarketPlaceStack;

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 60,
    backgroundColor: '#ffff',
    //  justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,

    shadowOffset: {width: 3, height: 0},
    elevation: 5,
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
