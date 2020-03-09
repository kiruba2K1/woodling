import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import moment from 'moment';
import {apiurl, imageurl} from '../../constants/config';
import {Avatar} from 'react-native-paper';

export default class NotificationProfileImage extends Component {
  render() {
    const {path, date_created} = this.props;
    return (
      <View style={styles.container}>
        <View>
          <Avatar.Image
            source={
              path === '' || path == null
                ? require('../../images/ic_account_circle_new.png')
                : {uri: `${imageurl}/${path}`}
            }
            size={68}
            style={{marginTop: 8}}
          />
        </View>
        <View style={styles.time}>
          <Text style={{fontFamily: 'Poppins-Medium', fontSize: 12}}>
            {' '}
            {moment(date_created, 'X').fromNow()}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  time: {
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
