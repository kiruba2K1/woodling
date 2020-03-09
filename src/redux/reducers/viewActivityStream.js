import { VIEW_ACTIVITY_STREAM, CLEAR_ACTIVITY_STREAM } from '../actions/reduxActions';

const initialState = {
  activitystream: [],
  loading:true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading:action.loading
      };
    case VIEW_ACTIVITY_STREAM:
      return {
        ...state,
        activitystream: [...state.activitystream.concat(action.payload)],
      };
    case CLEAR_ACTIVITY_STREAM:
      return {
        activitystream: []
      };
    default:
      return state;
  }
}
