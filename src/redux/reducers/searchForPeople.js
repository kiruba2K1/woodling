import { SEARCH_FOR_PEOPLE, CLEAR_SEARCHED_PEOPLE } from '../actions/reduxActions';

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
        case SEARCH_FOR_PEOPLE:
            return {
                ...state,
                search: [...state.search.concat(action.payload)],
            };
        case CLEAR_SEARCHED_PEOPLE:
            return {
                ...state,
                search: action.payload,
            };
        default:
            return state;
    }
}
