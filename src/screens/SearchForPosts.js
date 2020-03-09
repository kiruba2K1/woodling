import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {searchForPosts, clearPosts} from '../redux/actions/searchForPosts';
import CompleteStreamComponent from '../components/CompleteStreamComponent';
import TextView from '../components/TextView';

class SearchForPosts extends Component {
  state = {
    page: 1,
  };
  componentDidMount() {
    const {user_id, search, navigation} = this.props;
    const searchField = navigation.getParam('searchField');
    const search_keyword = searchField;
    this.setState({page: 1});
    const page = 1;
    const data = {search_keyword, page, user_id};
    this.props.searchForPosts(data);
    // console.warn(data);
  }
  componentWillUnmount() {
    this.props.clearPosts();
  }

  componentDidUpdate() {
    console.log(this.props.search);
  }

  onEndReached = () => {
    // alert('end')
    const {user_id, navigation} = this.props;
    const {page} = this.state;
    const searchField = navigation.getParam('searchField');
    this.setState({page: page + 1});
    const data = {search_keyword: searchField, user_id, page: page + 1};
    this.props.searchForPosts(data);
  };

  onRefresh = e => {
    const {user_id, navigation} = this.props;
    const searchField = navigation.getParam('searchField');
    this.setState({page: 1});
    const part = {search_keyword: searchField, user_id, page: 1};
    this.props.searchForPosts(part);
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
          keyExtractor={item => item.post_id}
          onEndReached={this.onEndReached}
          ListFooterComponent={
            <View>
              {loading === true ? (
                <ActivityIndicator />
              ) : (
                <Text style={{fontSize: 25}}>.</Text>
              )}
            </View>
          }
          contentContainerStyle={{backgroundColor: '#eeeeee'}}
          // renderItem={({item, index}) => (
          //   <CompleteStreamComponent
          //     item={item}
          //     type={item.type}
          //     navposition="SearchForPosts"
          //     refreshFeed={this.onRefresh}
          //   />
          // )}
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
  search: state.searchForPosts.search,
  loading: state.searchForPosts.loading,
});

export default connect(mapStateToProps, {searchForPosts, clearPosts})(
  SearchForPosts,
);
