import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-paper';
import defaultAvatar from '../images/ic_account_circle_24px.jpg';
import {imageurl} from '../constants/config';

const PremiumAvatar = props => {
  const {size = 30} = props;
  const source =
    props.source === undefined
      ? defaultAvatar
      : {['uri']: `${imageurl}/${props.source}`};
  return (
    <TouchableOpacity {...props}>
      <Avatar.Image style={styles.avatar} source={source} size={size} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    overflow: 'hidden',
  },
});

export default PremiumAvatar;
