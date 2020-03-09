import {
  PROFILE_PICTURE,
  GET_USERNAME,
  GET_EMAIL,
} from '../actions/reduxActions';

const initialState = {
  picture: '',
  username: '',
  email: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_PICTURE:
      return {
        ...state,
        picture: action.payload,
      };
    case GET_USERNAME:
      return {
        ...state,
        username: action.payload,
      };
    case GET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    default:
      return state;
  }
}
