import {
  ADD_POST_LOCATION,
  ADD_POST_TAG,
  POST_VALUES,
  CLEAR_TAGGED_PEOPLE,
  CLEAR_POST_LOCATION,
} from '../actions/reduxActions';

const initialState = {
  locationdescription: '',
  taggedpeople: [],
  postvalues: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_POST_LOCATION:
      return {
        ...state,
        locationdescription: action.payload,
      };
    case ADD_POST_TAG:
      return {
        ...state,
        taggedpeople: action.payload,
      };
    case CLEAR_TAGGED_PEOPLE:
      return {
        ...state,
        taggedpeople: action.payload,
      };
    case POST_VALUES:
      return {
        ...state,
        postvalues: action.payload,
      };
    case CLEAR_POST_LOCATION:
      return {
        ...state,
        locationdescription: action.payload,
      };
    default:
      return state;
  }
}
