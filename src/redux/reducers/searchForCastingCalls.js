import { SEARCH_CASTING_CALLS, CLEAR_CALL_SEARCH } from '../actions/reduxActions';

const initialState = {
    search: [],
    loading: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case "LOADING":
            return {
                ...state,
                loading: action.loading
            };
        case SEARCH_CASTING_CALLS:
            return {
                ...state,
                search: [...state.search.concat(action.payload)],
            };
        case CLEAR_CALL_SEARCH:
            return {
                ...state,
                search: action.payload,
            };
        default:
            return state;
    }
}
