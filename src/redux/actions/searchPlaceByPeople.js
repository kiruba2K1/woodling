import axios from 'axios';
import { SEARCH_PLACE_BY_PEOPLE, CLEAR_PLACE_BY_PEOPLE } from './reduxActions';
import { apiurl } from '../../constants/config';

export const searchPlaceByPeople = data => dispatch => {
    dispatch({
        type: "LOADING",
        loading: true
    });
    axios
        .post(`${apiurl}search-place-people.php`, data)
        .then(res => {
            // console.warn(res.data);
            if (res.data.status === 'success') {
                dispatch({
                    type: SEARCH_PLACE_BY_PEOPLE,
                    payload: res.data.people
                });
            } else if (res.data.status === 'empty') {
                dispatch({
                    type: SEARCH_PLACE_BY_PEOPLE,
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

export const clearPlaceByPeople = () => dispatch => {
    dispatch({
        type: CLEAR_PLACE_BY_PEOPLE,
        payload: []
    });
};