import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Snackbar} from 'react-native-paper';
import axios from 'axios';
import {connect} from 'react-redux';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import {apiurl} from '../constants/config';

const Customon = createIconSetFromFontello(fontelloConfig);
class LikeAComment extends Component {
  state = {
    like: false,
  };

  componentDidMount() {
    const {datum} = this.props;
    const {like_status} = datum;
    // console.log(this.props.datum);

    if (like_status === null) {
      this.setState({like: false});
    } else {
      this.setState({like: true});
    }
  }

  likeComment = async () => {
    const {user_id, datum} = this.props;
    const reaction = 'like';
    const {comment_id} = datum;
    this.setState({like: true});
    const postValues = {user_id, comment_id, reaction};
    // console.log(postValues);
    await axios
      .post(`${apiurl}add-comment-reaction.php`, postValues)
      .then(res => {
        console.log(res.data);
      })
      .catch(res => console.log(res.data));
  };

  unlikeComment = async () => {
    const {user_id, datum} = this.props;
    const reaction = 'unlike';
    const {comment_id} = datum;
    const postValues = {user_id, comment_id, reaction};
    // console.log(postValues);

    this.setState({like: false});
    await axios
      .post(`${apiurl}add-comment-reaction.php`, postValues)
      .then(res => {
        console.log(res.data);
      })
      .catch(res => console.log(res.data));
  };

  render() {
    const {like, visible} = this.state;
    return (
      <View>
        {like === false && (
          <Customon name="like-icon" color="red" onPress={this.likeComment} />
        )}
        {like && (
          <Customon
            name="like-selected"
            solid
            color="red"
            onPress={this.unlikeComment}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(LikeAComment);
