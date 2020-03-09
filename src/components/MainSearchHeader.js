import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Customon = createIconSetFromFontello(fontelloConfig);

const {width, height} = Dimensions.get('window');

const filters = [
  {name: 'posts', id: 1},
  {name: 'casting calls', id: 2},
  {name: 'people', id: 3},
  {name: 'events', id: 4},
  {name: 'products', id: 5},
  {name: 'services', id: 6},
  {name: 'hashtag', id: 7},
  {name: 'places', id: 8},
];

class MainSearchHeader extends Component {
  // componentDidMount() {
  //   console.warn(this.props.searchField);
  // }
  filterBy = a => {
    const {navigation, searchField} = this.props;
    // const actualroute = navigation.state.routes.find(
    //   route => route.routeName === 'SearchFilterScreen',
    // );
    // const {searchField} = actualroute.params;
    if (a.id == 1) {
      navigation.navigate('SearchForPosts', {
        filterParam: a.name,
        searchField,
      });
    }
    if (a.id == 2) {
      navigation.navigate('SearchCastingCalls', {
        filterParam: a.name,
        searchField,
      });
    }
    if (a.id == 3) {
      navigation.navigate('SearchOnlyPeople', {
        filterParam: a.name,
        searchField,
      });
    }
    if (a.id == 4) {
      navigation.navigate('SearchForEvents', {
        filterParam: a.name,
        searchField,
      });
    }
    if (a.id == 5) {
      navigation.navigate('SearchForProducts', {
        filterParam: a.name,
        searchField,
      });
    }
    if (a.id == 6) {
      navigation.navigate('SearchForServices', {
        filterParam: a.name,
        searchField,
      });
    }
    if (a.id == 7) {
      navigation.navigate('SearchHashtagsScreen', {
        filterParam: a.name,
        searchField,
      });
    }
    if (a.id == 8) {
      navigation.navigate('SearchAllPlaces', {
        filterParam: a.name,
        searchField,
      });
    }
  };
  render() {
    const {navigation, searchField} = this.props;
    // const actualroute = navigation.state.routes.find(
    //   route => route.routeName === 'SearchFilterScreen',
    // );
    // const {searchField} = actualroute.params;
    return (
      <View style={styles.root}>
        <View style={{height: 41}}></View>
        <View style={{height: 41}}>
          <View style={styles.searchContainer}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('TrendingScreen')}>
                <Customon name="x" />
              </TouchableOpacity>
            </View>
            <View style={{flex: 5}}>
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => navigation.navigate('SearchScreen')}>
                <Text>{searchField}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity>
                <Customon name="search" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{height: 54}}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignSelf: 'center'}}>
            {filters.map(e => (
              <View style={{marginHorizontal: 5}} key={e.id}>
                <TouchableOpacity onPress={() => this.filterBy(e)}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#ff9c9b', '#fbaead']}
                    style={styles.filterButton}>
                    <Text style={styles.buttonTextStyle}>{e.name}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width,
    height: 136,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#ffffff',
  },
  buttonTextStyle: {
    color: '#1c1c1c',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  filterButton: {
    height: 30,
    paddingHorizontal: 5,
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.39)',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    borderRadius: 6,
    // opacity: 0.8,
  },
  searchContainer: {
    backgroundColor: '#fff',
    width: '90%',
    height: '95%',
    flexDirection: 'row',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 5,
  },
});

export default withNavigation(MainSearchHeader);
