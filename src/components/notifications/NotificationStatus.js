import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {apiurl, imageurl} from '../../constants/config';

export default class NotificationStatus extends Component {
  constructor(props) {
    super(props);
  }

  onClick(
    type,
    navigation,
    userId,
    post_record,
    profile_thumb,
    item,
    isPremiumUser,
  ) {
    if (type == 'payment') {
      navigation.navigate('Wallet', {userId: userId});
    } else if (type == 'view_profile') {
      if (isPremiumUser) {
        navigation.navigate('ProfileScreen', {
          user_id: userId,
          theirid: item.user_id,
        });
      } else {
        navigation.navigate('PremiumMembership', {
          user_id: userId,
          theirid: item.user_id,
        });
      }
    } else if (type == 'review' || type == 'followed') {
      navigation.navigate('ProfileScreen', {
        user_id: userId,
        theirid: item.user_id,
      });
    } else if (
      type == 'like' ||
      type == 'post_comment' ||
      type == 'User liked your post'
    ) {
      if (post_record != undefined && post_record != null) {
        navigation.navigate('PostDetails', {
          type: post_record.type,
          postid: post_record.id,
          profile_thumb: profile_thumb,
        });
      }
    } else {
      console.log(item);
      alert(type);
    }
  }

  getView(post_record) {
    if (post_record != undefined && post_record != null) {
      return (
        <TouchableOpacity style={styles.commentImage}>
          <Image
            source={
              post_record.path === ''
                ? require('../../images/drama_illustration.png')
                : {uri: `${imageurl}/${post_record.path}`}
            }
            style={{width: 80, height: 60, marginTop: 8, borderRadius: 15}}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.commentImage}>
        <Image
          source={require('../../images/drama_illustration.png')}
          style={{width: 80, height: 60, marginTop: 8, borderRadius: 15}}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const {
      name,
      description,
      type,
      navigation,
      userId,
      post_record,
      profile_thumb,
      item,
      isPremiumUser,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={() =>
          this.onClick(
            type,
            navigation,
            userId,
            post_record,
            profile_thumb,
            item,
            isPremiumUser,
          )
        }
        style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>{name}</Text>
          <View style={{marginTop: -5}}>
            <Text style={styles.comments}>{description}</Text>
          </View>
        </View>

        {type == 'like' || type == 'post_comment'
          ? this.getView(post_record)
          : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    //  flex: 1,
  },

  wrapper: {
    justifyContent: 'center',
    paddingTop: 25,
    paddingLeft: 10,
  },
  title: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },

  comments: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    width: 211,
  },
});
