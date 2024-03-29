import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {
  searchForProducts,
  clearSearchedProducts,
} from '../redux/actions/searchForProducts';
import CompleteStreamComponent from '../components/CompleteStreamComponent';
import TextView from '../components/TextView';

class SearchForServices extends Component {
  state = {
    page: 1,
  };
  componentDidMount() {
    const {user_id, search, navigation} = this.props;
    const searchField = navigation.getParam('searchField');
    const name = searchField;
    const category = 'services';
    this.setState({page: 1});
    const page = 1;
    const data = {name, page, user_id, category};
    this.props.searchForProducts(data);
    // console.warn(data);
  }
  componentWillUnmount() {
    this.props.clearSearchedProducts();
  }

  // componentDidUpdate() {
  //     console.log(this.props.search)
  // }

  onEndReached = () => {
    // alert('end')
    const {user_id, navigation} = this.props;
    const {page} = this.state;
    const searchField = navigation.getParam('searchField');
    this.setState({page: page + 1});
    const data = {
      name: searchField,
      user_id,
      page: page + 1,
      category: 'services',
    };
    this.props.searchForProducts(data);
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
          //   ListFooterComponent={
          //     <View>
          //       {loading === true ? (
          //         <ActivityIndicator />
          //       ) : (
          //         <Text style={{fontSize: 25}}>.</Text>
          //       )}
          //     </View>
          //   }
          contentContainerStyle={{backgroundColor: '#eeeeee'}}
          renderItem={({item, index}) => (
            <CompleteStreamComponent item={item} type="product" />
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
  search: state.searchForProducts.search,
  loading: state.searchForProducts.loading,
});

export default connect(mapStateToProps, {
  searchForProducts,
  clearSearchedProducts,
})(SearchForServices);
