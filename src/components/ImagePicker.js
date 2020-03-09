import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { createIconSetFromFontello } from 'react-native-vector-icons';

import fontelloConfig from '../config.json';
import TextView from './TextView';
const Customon = createIconSetFromFontello(fontelloConfig);

export default class ImagePicker extends Component {
  state = {
    pickerVisible: true
  };

  fromGallery = () => {
    this.setState({ pickerVisible: false });
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    })
      .then(image => {
        const c = image.path.split('/');
        const len = c.length - 1;
        const photo = {
          uri: image.path,
          type: image.mime,
          name: c[len],
          size: image.size
        };
      })
      .catch(res => console.log(res.data));
  };

  fromCamera = () => {
    this.setState({ pickerVisible: false });
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true
    })
      .then(image => {
        const c = image.path.split('/');
        const len = c.length - 1;
        const photo = {
          uri: image.path,
          type: image.mime,
          name: c[len],
          size: image.size
        };
        console.log(photo, type, user_id);
      })
      .catch(res => console.log(res.data));
  };

  render() {
    const { pickerVisible } = this.state;
    const {showModal} = this.props;
    return (
      <View>
        <Portal>
          <Modal visible={showModal} onDismiss={() => this.setState({ pickerVisible: false })}>
            <View style={{ alignSelf: 'center' }}>
              <View style={styles.imagePicker}>
                <TouchableOpacity
                  onPress={this.fromGallery}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRightWidth: 0.5
                  }}>
                  <Customon name="images" size={40} />
                  <TextView style={styles.pickerText} text='Gallery'></TextView>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.fromCamera}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderLeftWidth: 0.5
                  }}>
                  <Customon name="camera-alt" size={40} />
                  <TextView style={styles.pickerText} text='Camera'></TextView>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagePicker: {
    width: 209,
    height: 123,
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#ffffff'
  },
  pickerText: {
    color: '#000000',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.01
  }
});
