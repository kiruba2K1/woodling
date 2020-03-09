/* eslint-disable class-methods-use-this */
import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {connect} from 'react-redux';
import {apiurl} from '../constants/config';
import ViewCastingCalls from '../components/ViewCastingCalls';
import EmptySubmissions from '../images/empty_submissions.png';
import TextView from '../components/TextView';

const {width, height} = Dimensions.get('window');
class AppliedJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataStatus: [],
      data: [],
      isFetching: false,
    };
  }

  componentWillMount() {
    const {user_id} = this.props;
    axios
      .get(`${apiurl}fetch-user-applied-jobs.php?user_id=${user_id}`)
      .then(res =>
        this.setState({dataStatus: res.data, data: res.data.casting_call}),
      )
      .catch(res => console.log(res.data));
  }

  onRefresh = async () => {
    this.setState({isFetching: true});
    const {user_id} = this.props;
    await axios
      .get(`${apiurl}fetch-user-applied-jobs.php?user_id=${user_id}`)
      .then(res =>
        this.setState({dataStatus: res.data, data: res.data.casting_call}),
      )
      .catch(res => console.log(res.data));
    this.setState({isFetching: false});
  };

  render() {
    const {data, dataStatus} = this.state;
    if (dataStatus.status === 'success') {
      return (
        <View
          style={[
            styles.container,
            {paddingBottom: data.length > 2 ? 150 : 0},
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
                date_created={item.date_created}
                production_type={item.production_type}
                formatted_address={item.formatted_address}
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
    if (dataStatus.status === 'empty') {
      return (
        <View style={styles.root}>
          <Image source={EmptySubmissions} />
          <TextView text="You haven't applied for any Casting Calls..."></TextView>
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
    height: height - 50,
    backgroundColor: '#eeeeee',
  },
});

export default connect(mapStateToProps)(AppliedJobs);
