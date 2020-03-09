import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {searchPeople, clearSearchedPeople} from '../redux/actions/searchPeople';
import FollowPeopleCard from '../components/FollowPeopleCard';
import TextView from '../components/TextView';

class SearchOnlyPeople extends Component {
  state = {
    page: 1,
  };
  componentDidMount() {
    const {user_id, search, navigation} = this.props;
    const searchField = navigation.getParam('searchField');
    const name = searchField;
    this.setState({page: 1});
    const page = 1;
    const data = {name, page, user_id};
    this.props.searchPeople(data);
    // console.warn(this.props.search);
  }
  componentWillUnmount() {
    this.props.clearSearchedPeople();
  }

  onEndReached = () => {
    // alert('end')
    const {user_id, navigation} = this.props;
    const {page} = this.state;
    const searchField = navigation.getParam('searchField');
    this.setState({page: page + 1});
    const data = {name: searchField, user_id, page: page + 1};
    this.props.searchPeople(data);
  };

  render() {
    const {search, loading} = this.props;
    if (
      loading === true &&
      (search.length === 0 || search.length === undefined)
    ) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }
    if (search.length === 0) {
      return (
        <TextView style={{textAlign: 'center'}} text='No search result found !!!' />
      );
    }
    return (
      <View style={styles.root}>
        <FlatList
          data={search}
          onEndReachedThreshold={1}
          numColumns={4}
          onEndReached={this.onEndReached}
          //   ListFooterComponent={
          //     <View>
          //       {loading === true ? (
          //         <ActivityIndicator />
          //       ) : (
          //         <Text style={{fontSize: 25}}>.</Text>
          //       )}
          //     </View>
          //   }
          // contentContainerStyle={{ backgroundColor: '#eeeeee' }}
          renderItem={({item, index}) => (
            <FollowPeopleCard
              type="casting_call"
              data={search}
              index={index}
              item={item}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fcfcfc',
    flex: 1,
  },
});
const mapStateToProps = state => ({
  user_id: state.userid.id,
  search: state.searchForPeople.search,
  loading: state.searchForPeople.loading,
});

export default connect(mapStateToProps, {searchPeople, clearSearchedPeople})(
  SearchOnlyPeople,
);
