import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import numeral from 'numeral';

// eslint-disable-next-line react/prefer-stateless-function
export default class ActivityPointer extends Component {
  render() {
    return (
      <View style={styles.tooltip}>
        <View
          style={{
            backgroundColor: '#f1f1f1',
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 2,
          }}>
          <Text style={{color: this.props.color}}>
            {numeral(parseInt(this.props.likes)).format('0 a')}
          </Text>
        </View>
        <View style={styles.triangle} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tooltip: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#f1f1f1',
    transform: [{rotate: '180deg'}],
  },
});
