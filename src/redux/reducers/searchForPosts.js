import { SEARCH_FOR_POSTS, CLEAR_SEARCHED_POSTS } from '../actions/reduxActions';

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
        case SEARCH_FOR_POSTS:
            return {
                ...state,
                search: [...state.search.concat(action.payload)],
            };
        case CLEAR_SEARCHED_POSTS:
            return {
                ...state,
                search: action.payload,
            };
        default:
            return state;
    }
}
