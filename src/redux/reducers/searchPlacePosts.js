import { SEARCH_PLACE_POSTS, CLEAR_PLACE_POSTS } from '../actions/reduxActions';

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
        case SEARCH_PLACE_POSTS:
            return {
                ...state,
                search: [...state.search.concat(action.payload)],
            };
        case CLEAR_PLACE_POSTS:
            return {
                ...state,
                search: action.payload,
            };
        default:
            return state;
    }
}
