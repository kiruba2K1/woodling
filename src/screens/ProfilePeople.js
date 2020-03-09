import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ProfilePeopleComponent from '../components/ProfilePeopleComponent';
import { fetchuserfollowing } from '../redux/actions/fetchUserFollowing';
import { fetchuserfollowers } from '../redux/actions/fetchuserfollowers';
import axios from 'axios';
import { apiurl } from '../constants/config';
import TextView from '../components/TextView';

class ProfilePeople extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabState: 'followers'
    };
  }

  componentWillMount() {
    const { user_id } = this.props;
    // const user_id = 3;
    this.props.fetchuserfollowers(user_id);
    this.props.fetchuserfollowing(user_id);
  }

   Unfollow=async (followerId)=> {
    const { user_id } = this.props;
    this.setState({ following: false });
    await axios
      .post(`${apiurl}unfollow-user.php?user_id=${followerId}&follower_id=${user_id}`)
      .then(res =>{
        if(res.data.status=='success')
        {
          this.props.fetchuserfollowers(user_id);
          this.props.fetchuserfollowing(user_id);
        }
        else{
          console.warn(res.data)
        }
      })
      .catch(res => console.warn(res.data));
  }

  Follow=(followerId)=>{
    const { user_id } = this.props;

    axios
      .get(`${apiurl}follow-user.php?user_id=${followerId}&follower_id=${user_id}`)
      .then(res => {
        if(res.data.status=='success')
        {
          this.props.fetchuserfollowers(user_id);
          this.props.fetchuserfollowing(user_id);
        }
        else{
          console.warn(res.data)
        }
      })
      .catch(res => console.warn(res));
  }



  // componentWillReceiveProps(as) {
  //     console.log(as.followers, as.following);
  // }
  render() {
    const { following, followers ,user_id} = this.props;
    const { tabState } = this.state;
    return (
      <View>
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <TouchableOpacity
            onPress={() => this.setState({ tabState: 'followers' })}
            style={styles.buttonLeft}>
            <TextView style={{ color: tabState === 'followers' ? 'red' : '#dedede' }} text='Followers' />
            {/* <Text style={{ color: tabState === 'followers' ? 'red' : '#dedede' }}>{following.data !== [] && followers.data.length}</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ tabState: 'following' })}
            style={styles.buttonRight}>
            <TextView style={{ color: tabState === 'following' ? 'red' : '#dedede' }} text='Following' />
            {/* <Text style={{ color: tabState === 'following' ? 'red' : '#dedede' }}>{followers.data !== [] && following.data.length}</Text> */}
          </TouchableOpacity>
        </View>
        <View style={[styles.rectangle34, { marginVertical: 20 }]}>
          <FlatList
            data={tabState === 'followers' ? followers.data : following.data}
            refreshing
            initialNumToRender={2}
            removeClippedSubviews
            keyExtractor={item => item.id}
            onViewableItemsChanged={this.onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50
            }}
            renderItem={({ item }) => (
              <ProfilePeopleComponent user_id={user_id} item={item} Follow={this.Follow} unFollow={this.Unfollow} followers={tabState === 'followers'}  full_name={item.full_name} username={item.username} />
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rectangle34: {
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: { width: -1, height: 0 },
    shadowRadius: 6,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#ffffff',
    paddingVertical: 10
  },
  buttonLeft: {
    width: 106,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 6,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 0,
    backgroundColor: '#ffffff',
    elevation: 2
  },
  buttonRight: {
    width: 106,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 100,
    backgroundColor: '#ffffff',
    elevation: 3
  }
});

const mapStateToProps = state => ({
  followers: state.followerslist.followers,
  following: state.followinglist.following,
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture
});

export default connect(
  mapStateToProps,
  { fetchuserfollowing, fetchuserfollowers }
)(ProfilePeople);
