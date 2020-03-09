import React, { Component } from 'react';
import { Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import SingleHashtag from '../components/SingleHashtag';
import { apiurl } from '../constants/config';
import TextView from '../components/TextView';

export default class SearchHashtagsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const searchField = navigation.getParam('searchField')
    // alert(searchField)
    // console.warn(this.props.navigation)
    axios
      .get(`${apiurl}search-tags.php?keyword=${searchField}`)
      .then(res => {
        console.warn(res.data);
        this.setState({ data: res.data });
      })
      .catch(res => alert('unable to fetch'));
  }

  render() {
    const { navigation } = this.props;
    const { data } = this.state;
    const searchField = navigation.getParam('searchField')
    return (
      <View style={{ flex: 1 }}>
        {data.length !== 0 ? (
          <View>
            {data.status === 'success' ? (
              <FlatList
                data={data.tags}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <SingleHashtag item={item} searchField={searchField} />}
              />
            ) : (
                <View>
                  <TextView style={{ fontSize: 20, color: 'black' }} text='Your search does not match any saved tags' />
                </View>
              )}
          </View>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator />
            </View>
          )}
      </View>
    );
  }
}
