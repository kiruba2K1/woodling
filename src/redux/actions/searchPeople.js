import axios from 'axios';
import { SEARCH_FOR_PEOPLE, CLEAR_SEARCHED_PEOPLE } from './reduxActions';
import { apiurl } from '../../constants/config';

export const searchPeople = data => dispatch => {
    dispatch({
        type: "LOADING",
        loading: true
    });
    axios
        .post(`${apiurl}search-people.php`, data)
        .then(res => {
            console.warn(res.data);
            if (res.data.status === 'success') {
                dispatch({
                    type: SEARCH_FOR_PEOPLE,
                    payload: res.data.people
                });
            } else if (res.data.status === 'empty') {
                dispatch({
                    type: SEARCH_FOR_PEOPLE,
                    payload: []
                });
            }
            dispatch({
                type: "LOADING",
                loading: false
            });
        })
        .catch(res => {
            console.warn('unable to send')
            dispatch({
                type: "LOADING",
                loading: false
            });
        });
};

export const clearSearchedPeople = () => dispatch => {
    dispatch({
        type: CLEAR_SEARCHED_PEOPLE,
        payload: []
    });
};