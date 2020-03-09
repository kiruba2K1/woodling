import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  FlatList,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SearchPeopleContainer from '../components/SearchPeopleContainer';
import CompleteStreamComponent from '../components/CompleteStreamComponent';
import {searchPeople} from '../redux/actions/searchPeople';
import {
  generalSearch,
  clearGeneralSearch,
} from '../redux/actions/generalSearch';
import {connect} from 'react-redux';

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
const mock = [
  {type: 'text'},
  {type: 'video'},
  {type: 'event'},
  {type: 'script'},
];

class SearchFilterScreen extends Component {
  state = {
    search_keyword: '',
    page: 1,
  };
  componentDidMount() {
    const {user_id, navigation} = this.props;
    const searchField = navigation.getParam('searchField');
    this.setState({page: 1});
    const data = {name: searchField, user_id, page: 1};
    const part = {search_keyword: searchField, user_id, page: 1};
    this.props.searchPeople(data);
    this.props.generalSearch(part);
  }

  // componentDidUpdate() {
  //   console.warn(this.props.item);
  // }

  onEndReached = () => {
    // alert('end')
    const {user_id, navigation} = this.props;
    const {page} = this.state;
    const searchField = navigation.getParam('searchField');
    this.setState({page: page + 1});
    const data = {search_keyword: searchField, user_id, page: page + 1};
    this.props.generalSearch(data);
  };

  componentWillUnmount() {
    this.props.clearGeneralSearch();
  }
  // UNSAFE_componentWillReceiveProps(b) {
  //     console.warn(b.activitySearch)
  // }
  // filterBy = a => {
  //   const {navigation} = this.props;
  //   if (a.id == 2) {
  //     navigation.navigate('SearchCastingCalls', {
  //       filterParam: a.name,
  //     });
  //   }
  // };
  onRefresh = e => {
    const {user_id, navigation} = this.props;
    const searchField = navigation.getParam('searchField');
    this.setState({page: 1});
    const part = {search_keyword: searchField, user_id, page: 1};
    this.props.generalSearch(part);
  };

  render() {
    const {search_keyword} = this.state;
    const {search, activitySearch, activityisLoading} = this.props;
    if (
      activityisLoading === true &&
      (activitySearch.length === 0 || activitySearch.length === undefined)
    ) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }
    if (activitySearch.length === 0) {
      return <Text>No search result found !!!</Text>;
    }
    return (
      <View style={styles.root}>
        <FlatList
          data={activitySearch}
          contentContainerStyle={{backgroundColor: '#eeeeee'}}
          onEndReachedThreshold={1}
          onEndReached={this.onEndReached}
          ListHeaderComponent={
            <View style={styles.peopleContainer}>
              <FlatList
                horizontal
                keyExtractor={item => item.post_id}
                showsHorizontalScrollIndicator={false}
                data={search}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#e7e4e9',
                      justifyContent: 'space-around',
                    }}>
                    <SearchPeopleContainer
                      data={search}
                      item={item}
                      index={index}
                    />
                  </View>
                )}
              />
            </View>
          }
          // ListFooterComponent={() =>
          //   activityisLoading === true ? (
          //     <ActivityIndicator />
          //   ) : (
          //     <Text style={{fontSize: 20}}>.</Text>
          //   )
          // }
          renderItem={({item, index}) => (
            <CompleteStreamComponent
              item={item}
              type={item.type}
              navposition="SearchFilterScreen"
              refreshFeed={this.onRefresh}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  searchContainer: {
    width: '90%',
    height: 41,
    flexDirection: 'row',
    alignSelf: 'center',
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {width: 3, height: 0},
    shadowRadius: 6,
    borderRadius: 5,
    // backgroundColor: '#3366ff',
  },
  searchContent: {
    alignItems: 'center',
    justifyContent: 'center',
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
  peopleContainer: {
    width,
    height: 174,
    backgroundColor: '#e7e4e9',
  },
});

const mapStateToProps = state => ({
  search: state.searchForPeople.search,
  activitySearch: state.generalSearch.search,
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  activityisLoading: state.generalSearch.loading,
});

export default connect(mapStateToProps, {
  searchPeople,
  generalSearch,
  clearGeneralSearch,
})(SearchFilterScreen);
