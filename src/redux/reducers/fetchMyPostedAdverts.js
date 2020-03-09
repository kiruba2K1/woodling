import {FETCH_MY_POSTED_ADVERTS} from '../actions/reduxActions';

const initialState = {
  postedads: [],
  loading: true,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_MY_POSTED_ADVERTS:
      return {
        ...state,
        postedads: action.payload,
      };
    case 'LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}
