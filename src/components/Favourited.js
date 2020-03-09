/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import ActivityStream from '../components/ActivityStream';
import {fetchFavoritedProducts} from '../redux/actions/fetchFavoritedProducts';

class Favourited extends Component {
  componentDidMount() {
    const {isLoading, favoritedprods, user_id} = this.props;
    const data = {user_id};
    this.props.fetchFavoritedProducts(data);
  }

  // componentDidUpdate() {
  //   const {isLoading, favoritedprods} = this.props;
  //   console.log(isLoading);
  // }
  render() {
    const {isLoading, favoritedprods} = this.props;
    if (isLoading === false) {
      return (
        <View style={styles.container}>
          <View style={styles.favourite}>
            <FlatList
              // onRefresh={this.onRefresh}
              // refreshing={this.state.refreshing}
              data={favoritedprods}
              renderItem={({item}) => (
                <ActivityStream
                  productname={item.name}
                  productcurrency={item.currency}
                  productpurpose={item.purpose}
                  productprice={item.price}
                  producttype={item.product_type}
                  address={item.formatted_address}
                  type={item.type}
                  path={item.path}
                  likes={item.likes}
                  like_status={item.like_status}
                  theirid={item.post_user_id}
                  postid={item.post_id}
                  productid={item.product_id}
                  likestatus={item.like_status}
                  Item={item}
                />
              )}
            />
          </View>
        </View>
      );
    }
    return <ActivityIndicator color="#fb0201" size="large" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  favourite: {
    // justifyContent: 'center',
    // alignItems: 'center',
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
  },
});

const mapStateToProps = state => ({
  favoritedprods: state.fetchFavoritedProducts.favoritedprods,
  isLoading: state.fetchFavoritedProducts.loading,
  user_id: state.userid.id,
});

export default connect(mapStateToProps, {fetchFavoritedProducts})(Favourited);
