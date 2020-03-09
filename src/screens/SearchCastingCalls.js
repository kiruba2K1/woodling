import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {searchForCalls, clearCallSearch} from '../redux/actions/searchForCalls';
import CompleteStreamComponent from '../components/CompleteStreamComponent';
import TextView from '../components/TextView';

class SearchCastingCalls extends Component {
  state = {
    page: 1,
  };
  componentDidMount() {
    const {user_id, search, navigation} = this.props;
    const searchField = navigation.getParam('searchField');
    const casting_call = searchField;
    this.setState({page: 1});
    const page = 1;
    const data = {casting_call, page, user_id};
    this.props.searchForCalls(data);
    // console.warn(this.props.search);
  }
  componentWillUnmount() {
    this.props.clearCallSearch();
  }

  onEndReached = () => {
    // alert('end')
    const {user_id, navigation} = this.props;
    const {page} = this.state;
    const searchField = navigation.getParam('searchField');
    this.setState({page: page + 1});
    const data = {casting_call: searchField, user_id, page: page + 1};
    this.props.searchForCalls(data);
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
          renderItem={({item, index}) => (
            <CompleteStreamComponent
              type="casting_call"
              item={item}
              casting_call_id={item.id}
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
  search: state.searchForCalls.search,
  loading: state.searchForCalls.loading,
});

export default connect(mapStateToProps, {searchForCalls, clearCallSearch})(
  SearchCastingCalls,
);
