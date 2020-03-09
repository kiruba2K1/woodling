import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import {apiurl, imageurl} from '../constants/config.js';
import LikeAComment from './LikeAComment.js';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {withNavigation} from 'react-navigation';
import TextView from './TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

class ViewComments extends Component {
  // componentDidMount() {
  //   console.log(this.props.post_id);
  // }
  state = {
    like: true,
  };

  render() {
    const {like} = this.state;
    const {datum, post_id} = this.props;
    return (
      <View style={{marginBottom: 10}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <View style={{flex: 2, flexDirection: 'row'}}>
            <View style={{flex: 3}}>
              <Avatar.Image
                size={37}
                style={styles.avatarStyle}
                source={
                  datum.profile_thumb === ''
                    ? require('../images/Avatar_invisible_circle_1.png')
                    : {uri: `${imageurl}/${datum.profile_thumb}`}
                }
              />
            </View>
            <View style={{flex: 10, justifyContent: 'center'}}>
              <Text>{datum.full_name}</Text>
              <Text>{datum.comment}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1}}>
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.navigate('PostCommentsReply', {datum})
                }>
                <TextView text='Reply'></TextView>
              </TouchableHighlight>
            </View>
            <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
              <LikeAComment {...this.props} />
              <TextView text={`Likes(${datum.likes})`}></TextView>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatarStyle: {
    borderWidth: 2,
    borderColor: 'gold',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withNavigation(ViewComments);
