import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import {Avatar} from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import defaultImg from '../images/ic_account_circle_24px.jpg';
import {imageurl} from '../constants/config';

class SearchPeopleContainer extends Component {
  render() {
    const {data, index, item, navigation, user_id} = this.props;
    const lastElement = data.length - 1 === index;
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.root}>
          <TouchableOpacity
            onPress={() => {
              //   console.warn(item);
              navigation.navigate('ProfileScreen', {
                user_id,
                theirid: item.id,
              });
            }}>
            <Avatar.Image
              source={
                item.profile_thumb !== ''
                  ? {uri: `${imageurl}/${item.profile_thumb}`}
                  : defaultImg
              }
              size={90}
              style={{
                borderWidth: 3,
                borderColor: '#fb0201',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          </TouchableOpacity>
          <Text>{item.username}</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={parseInt(item.rating)}
            starSize={13}
            fullStarColor="red"
            starStyle={{width: 15}}
            containerStyle={{
              width: 15,
              justifyContent: 'center',
              marginVertical: 10,
            }}
          />
        </View>
        {!lastElement && (
          <View style={{height: 135, width: 1, backgroundColor: '#fcfcfc'}} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height: 135,
    width: 140,
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(withNavigation(SearchPeopleContainer));
