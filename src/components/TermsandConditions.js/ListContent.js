import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import HTML from 'react-native-render-html';
// import StyledText from 'react-native-styled-text';

const ListContent = props => {
  const {body} = props;
  return (
    <View style={styles.bodyContainer}>
      <HTML html={body} style={styles.bodyText} />
    </View>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  bodyText: {
    color: '#000000',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ListContent;
