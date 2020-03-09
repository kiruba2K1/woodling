import {FETCH_FAVORITED_PRODUCTS} from '../actions/reduxActions';

const initialState = {
  favoritedprods: [],
  loading: true,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_FAVORITED_PRODUCTS:
      return {
        ...state,
        favoritedprods: action.payload,
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
