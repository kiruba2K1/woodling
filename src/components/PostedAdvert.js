/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import ActivityStream from '../components/ActivityStream';
import {ActivityIndicator} from 'react-native-paper';
import {fetchMyPostedAdverts} from '../redux/actions/fetchMyPostedAdverts';

const {width, height} = Dimensions.get('window');
class PostedAdvert extends Component {
  componentDidMount() {
    const {user_id} = this.props;
    const data = {user_id};
    this.props.fetchMyPostedAdverts(data);
  }
  // componentDidUpdate() {
  //   const {postedads} = this.props;
  //   console.log(postedads);
  // }
  render() {
    const {postedads, isLoading} = this.props;
    if (isLoading === false && postedads !== undefined) {
      return (
        <View style={styles.container}>
          <View style={styles.favourite}>
            <FlatList
              // onRefresh={this.onRefresh}
              // refreshing={this.state.refreshing}
              data={postedads}
              keyExtractor={e => e.post_id}
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
    if (isLoading === false && postedads === undefined) {
      return (
        <Image
          source={require('../images/empty-adverts-img.png')}
          style={{height: height - 100, width}}
          resizeMode="contain"
        />
      );
    }
    return <ActivityIndicator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  favourite: {
    //justifyContent: 'center',
    // alignItems: 'center',
    // padding: 20,
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
  },
});

const mapStateToProps = state => ({
  postedads: state.fetchMyPostedAdverts.postedads,
  isLoading: state.fetchMyPostedAdverts.loading,
  user_id: state.userid.id,
});

export default connect(mapStateToProps, {fetchMyPostedAdverts})(PostedAdvert);
