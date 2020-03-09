import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import axios from 'axios';
import {Avatar} from 'react-native-paper';
import {connect} from 'react-redux';
import {apiurl, imageurl} from '../constants/config';
import {SearchBar} from 'react-native-elements';
import language from '../constants/language.js';

class SearchChatUser extends Component {
  state = {
    data: [],
    loading: false,
    search: '',
    lan: 'en',
  };

  componentDidMount() {
    const {user_id} = this.props;
    this._retrieveData();
    axios
      //.get(`${apiurl}fetch-explore-users.php?user_id=${user_id}`)
      .get(`${apiurl}fetch-user-followers.php?user_id=${user_id}`)
      .then(res => {
        console.log(res.data);
        this.setState({data: res.data});
      })
      .catch(res => console.log(res.data));
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if (value == 'fr') {
          this.setState({
            lan: 'fr',
          });
        } else {
          this.setState({
            lan: 'en',
          });
        }
      } else {
        alert('Else exicute : ' + value);
      }
    } catch (error) {
      //alert("error");
      console.log('--------- Error', error);
      // Error retrieving data
    }
  };

  messageUser = async e => {
    const {data, user_id, profile_picture, navigation} = this.props;
    const user = {
      user_id: e.id,
      picture:
        e.profile_thumb === ''
          ? 'https://www.sccpre.cat/mypng/detail/214-2144186_alpesh-m-avatar-thumbnail.png'
          : `${imageurl}/${e.profile_thumb}`,
      name: e.full_name,
    };

    this.props.navigation.navigate('MessagingScreen', {
      theirid: e.id,
      user,
    });
  };

  updateSearch(search) {
    const {data, user_id, profile_picture, navigation} = this.props;
    console.log(user_id, search);
    axios
      .get(
        `${apiurl}search-user-followers.php?user_id=${user_id}&search=${search}`,
      )
      .then(res => {
        console.log('Search Data : ', res.data);
        this.setState({data: res.data});
      })
      .catch(res => console.log('Error : ', res));
    this.setState({search});
  }

  render() {
    const {search, lan} = this.state;
    const {data} = this.state;
    if (data.length !== 0) {
      return (
        <View style={{flex: 1}}>
          <SearchBar
            placeholder={language.promotions.type_here(lan)}
            onChangeText={val => this.updateSearch(val)}
            value={search}
            lightTheme
            round
            inputContainerStyle={{backgroundColor: 'white', color: 'black'}}
            inputStyle={{color: 'black'}}
          />
          <FlatList
            data={data.data}
            // initialNumToRender={2}
            viewabilityConfig={this.viewabilityConfig}
            onViewableItemsChanged={this.onViewableItemsChanged}
            onEndReachedThreshold={1}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => this.messageUser(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Avatar.Image
                    source={
                      item.profile_thumb === ''
                        ? require('../images/ic_account_circle_24px.jpg')
                        : {uri: `${imageurl}/${item.profile_thumb}`}
                    }
                    size={50}
                  />
                </View>
                <View style={{flex: 4}}>
                  <Text
                    style={{color: 'black', fontSize: 18, fontWeight: '400'}}
                    numberOfLines={1}>
                    {item.full_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
    return <ActivityIndicator />;
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(SearchChatUser);
