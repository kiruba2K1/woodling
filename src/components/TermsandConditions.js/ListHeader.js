import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import RedBanner from '../../images/red-banner.png';

const {width, height} = Dimensions.get('window');

const ListHeader = props => {
  const {title, number} = props;
  return (
    <ImageBackground source={RedBanner} style={styles.imageStyle}>
      <Text
        style={[styles.textTitle1, {fontSize: title.length > 25 ? 12 : 19}]}>
        {title}
      </Text>
      <Text style={styles.number}>{number}</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width,
    height: 60,
    paddingHorizontal: 10,
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textTitle1: {
    width: 315,
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontWeight: '700',
    textAlign: 'right',
  },
  number: {
    opacity: 0.85,
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontSize: 35,
    fontWeight: '700',
  },
});

export default ListHeader;
