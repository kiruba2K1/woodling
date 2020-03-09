import {
  FETCH_PRODUCTION_TYPE,
  FETCH_SERVICE_TYPE,
  FETCH_PRODUCT_TYPE,
} from '../actions/reduxActions';

const initialState = {
  productiontype: [],
  servicetype: [],
  producttype: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTION_TYPE:
      return {
        ...state,
        productiontype: action.payload,
      };
    case FETCH_SERVICE_TYPE:
      return {
        ...state,
        servicetype: action.payload,
      };
    case FETCH_PRODUCT_TYPE:
      return {
        ...state,
        producttype: action.payload,
      };
    default:
      return state;
  }
}
