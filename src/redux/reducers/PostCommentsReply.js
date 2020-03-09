import {
  FETCH_COMMENT_REPLY,
  ADD_COMMENT_REPLY,
  CLEAR_COMMENT_REPLY,
} from '../actions/reduxActions';

const initialState = {
  postcomments: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_COMMENT_REPLY:
      return {
        ...state,
        postcomments: action.payload,
      };
    case CLEAR_COMMENT_REPLY:
      return {
        postcomments: [],
      };
    default:
      return state;
  }
}
