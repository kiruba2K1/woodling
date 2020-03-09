import { GENERAL_SEARCH, CLEAR_GENERAL_SEARCH } from '../actions/reduxActions';

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
        case GENERAL_SEARCH:
            return {
                ...state,
                search: [...state.search.concat(action.payload)],
            };
        case CLEAR_GENERAL_SEARCH:
            return {
                ...state,
                search: action.payload,
            };
        default:
            return state;
    }
}
