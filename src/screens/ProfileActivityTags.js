import React, {Component} from 'react';
import {Text, View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import ActivityStream from '../components/ActivityStream';

// eslint-disable-next-line react/prefer-stateless-function
class ProfileActivityTags extends Component {
  componentDidMount() {
    console.log(this.props.taggedposts);
  }

  render() {
    const {taggedposts} = this.props;
    return (
      <View>
        <FlatList
          data={taggedposts.data}
          initialNumToRender={2}
          removeClippedSubviews
          keyExtractor={item => item.post_id}
          renderItem={({item}) => (
            <ActivityStream
              full_name={item.full_name}
              username={item.username}
              datecreated={item.date_created}
              likestatus={item.like_status}
              text={item.body}
              type={item.type}
              address={item.address}
              path={item.path}
              event_type={item.event_type}
              likes={item.likes}
              comments={item.comments}
              caption={item.caption}
              postid={item.post_id}
              Item={item}
              theirid={item.user_id}
            />
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  taggedposts: state.taggedposts.taggedposts,
});

export default connect(mapStateToProps)(ProfileActivityTags);
