import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {connect} from 'react-redux';
import {apiurl} from '../constants/config';
import ViewCastingCalls from '../components/ViewCastingCalls';
import EmptyPostedJobs from '../images/empty_posted_jobs.png';
import TextView from '../components/TextView';

const {width, height} = Dimensions.get('window');
class MyPostedJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postedStatus: [],
      data: [],
      isFetching: false,
    };
  }

  componentDidMount() {
    const {user_id} = this.props;
    axios
      .get(`${apiurl}fetch-user-posted-jobs.php?user_id=${user_id}`)
      .then(res => {
        console.warn(res.data);
        this.setState({
          postedStatus: res.data,
          data: res.data.data,
        });
      })
      .catch(res => console.table(res.data));
  }

  onRefresh = async () => {
    this.setState({isFetching: true});
    const {user_id} = this.props;
    axios
      .get(`${apiurl}fetch-user-posted-jobs.php?user_id=${user_id}`)
      .then(res => {
        console.warn(res.data);
        this.setState({
          postedStatus: res.data,
          data: res.data.data,
        });
      })
      .catch(res => console.table(res.data));
    this.setState({isFetching: false});
  };

  render() {
    const {data, postedStatus} = this.state;
    if (postedStatus.status === 'success') {
      return (
        <View
          style={[
            styles.container,
            {paddingBottom: data.length > 2 ? 100 : 0},
          ]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            removeClippedSubviews
            contentContainerStyle={{marginTop: 10}}
            refreshing={this.state.isFetching}
            onRefresh={this.onRefresh}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <ViewCastingCalls
                key={index}
                title={item.title}
                roles_count={item.roles_count}
                production_type={item.production_type}
                formatted_address={item.country}
                date_created={item.date_created}
                description={item.description}
                skill={item.skill}
                active={item.active}
                postid={item.id}
              />
            )}
          />
        </View>
      );
    }
    if (postedStatus.status === 'empty') {
      return (
        <View style={styles.root}>
          <Image source={EmptyPostedJobs} />
          <TextView text="You haven't posted any Casting Calls yet..." />
        </View>
      );
    }
    return <ActivityIndicator color="black" size="large" />;
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

const styles = StyleSheet.create({
  root: {
    // flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  container: {
    backgroundColor: '#eee',
    height: height - 50,
  },
});

export default connect(mapStateToProps)(MyPostedJobs);
