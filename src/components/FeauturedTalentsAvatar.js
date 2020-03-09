import React, {Component} from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-paper';
import {withNavigation} from 'react-navigation';
import axios from 'axios';
import {connect} from 'react-redux';
import {apiurl, imageurl} from '../constants/config';

import TextView from './TextView';

class FeauturedTalentsAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const {user_id} = this.props;
    axios
      .get(`${apiurl}fetch-featured-talents.php?user_id=${user_id}`)
      .then(res => this.setState({data: res.data.featured_talents}))
      .catch(res => console.log('error reading feautured talents'));
  }

  componentDidUpdate() {
    console.log(this.state.data);
  }

  render() {
    const {data} = this.state;
    return (
      <View style={{backgroundColor: '#ffffff'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}>
          <TextView style={{color: 'red'}} text='Featured Talents'></TextView>
          <TextView style={{color: 'red'}} text='This Week'></TextView>
        </View>
        <FlatList
          horizontal
          data={data}
          keyExtractor={item => item.user_id}
          renderItem={({item}) => (
            <View style={{marginHorizontal: 20, marginVertical: 10}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ProfileScreen', {
                    user_id: this.props.user_id,
                    theirid: item.user_id,
                  })
                }>
                <Avatar.Image
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderWidth: 3,
                    borderColor: '#fb0201',
                  }}
                  source={
                    item.profile_thumb === ''
                      ? require('../images/Avatar_invisible_circle_1.png')
                      : {uri: `${imageurl}/${item.profile_thumb}`}
                  }
                  size={70}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(withNavigation(FeauturedTalentsAvatar));
