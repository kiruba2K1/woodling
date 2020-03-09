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
import {
  searchPlaceByPeople,
  clearPlaceByPeople,
} from '../redux/actions/searchPlaceByPeople';
import {
  searchPlacePosts,
  clearPlacePosts,
} from '../redux/actions/searchPlacePosts';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('window');

class SearchAllPlaces extends Component {
  state = {
    search_keyword: '',
    page: 1,
    peoplePage: 1,
  };
  componentDidMount() {
    const {user_id, navigation} = this.props;
    const searchField = navigation.getParam('searchField');
    this.setState({page: 1, peoplePage: 1});
    const part = {search_keyword: searchField, user_id, page: 1};
    this.props.searchPlaceByPeople(part);
    this.props.searchPlacePosts(part);
  }

  onPeopleEnd = () => {
    // alert('end')
    const {user_id, navigation} = this.props;
    const {peoplePage} = this.state;
    const searchField = navigation.getParam('searchField');
    this.setState({peoplePage: peoplePage + 1});
    const data = {search_keyword: searchField, user_id, page: peoplePage + 1};
    this.props.searchPlaceByPeople(data);
  };

  onEndReached = () => {
    // alert('end')
    const {user_id, navigation} = this.props;
    const {page} = this.state;
    const searchField = navigation.getParam('searchField');
    this.setState({page: page + 1});
    const data = {search_keyword: searchField, user_id, page: page + 1};
    this.props.searchPlacePosts(data);
  };

  componentWillUnmount() {
    this.props.clearPlacePosts();
  }
  // UNSAFE_componentWillReceiveProps(b) {
  //     console.warn(b.activitySearch)
  // }
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
    if (search.length === 0) {
      return (
        <Text style={{textAlign: 'center'}}>No search result found !!!</Text>
      );
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
                onEndReachedThreshold={1}
                onEndReached={this.onPeopleEnd}
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
          //   ListFooterComponent={() =>
          //     activityisLoading === true ? (
          //       <ActivityIndicator />
          //     ) : (
          //       <Text style={{fontSize: 20}}>.</Text>
          //     )
          //   }
          renderItem={({item, index}) => (
            <CompleteStreamComponent item={item} type={item.type} />
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
  search: state.searchPlaceByPeople.search,
  activitySearch: state.searchPlacePosts.search,
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
  activityisLoading: state.generalSearch.loading,
});

export default connect(mapStateToProps, {
  searchPlaceByPeople,
  clearPlaceByPeople,
  searchPlacePosts,
  clearPlacePosts,
})(SearchAllPlaces);
