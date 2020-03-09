import React, {Component} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import {Portal, Modal} from 'react-native-paper';

export default class CustomModal extends Component {
  render() {
    return (
      <Portal>
        <Modal {...this.props}>
          <View>
            <ActivityIndicator size="large" color="#fb0201" />
          </View>
        </Modal>
      </Portal>
    );
  }
}
