import axios from 'axios';
import {
  FETCH_COMMENT_REPLY,
  CLEAR_COMMENT_REPLY,
  ADD_COMMENT_REPLY,
} from './reduxActions';
import {apiurl} from '../../constants/config';

// eslint-disable-next-line import/prefer-default-export
export const fetchCommentsReply = data => dispatch => {
  console.log(data);
  axios
    .get(
      `${apiurl}fetch-comment-reply.php?user_id=${data.user_id}&post_id=${data.post_id}&comment_id=${data.comment_id}`,
    )
    .then(res => {
      console.log(res.data);
      // console.log(res.data.data);
      dispatch({
        type: FETCH_COMMENT_REPLY,
        payload: res.data,
      });
    })
    .catch(res => console.log('error'));
};

export const clearCommentReply = () => dispatch => {
  dispatch({
    type: CLEAR_COMMENT_REPLY,
    payload: [],
  });
};
