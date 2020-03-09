import React, { Component } from 'react';
import { Text, View } from 'react-native';
import TextView from './TextView';

export default class RecordComponent extends Component {
  render() {
    return (
      <View>
        <TextView text='snitch recorder'>  </TextView>
      </View>
    );
  }
}
