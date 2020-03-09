import axios from 'axios';
import { SEARCH_FOR_EVENTS, CLEAR_SEARCHED_EVENTS } from './reduxActions';
import { apiurl } from '../../constants/config';

export const searchForEvents = data => dispatch => {
    dispatch({
        type: "LOADING",
        loading: true
    });
    axios
        .post(`${apiurl}search-events.php`, data)
        .then(res => {
            console.warn(res.data);
            if (res.data.status === 'success') {
                dispatch({
                    type: SEARCH_FOR_EVENTS,
                    payload: res.data.events
                });
            } else if (res.data.status === 'empty') {
                dispatch({
                    type: SEARCH_FOR_EVENTS,
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

export const clearSearchedEvents = () => dispatch => {
    dispatch({
        type: CLEAR_SEARCHED_EVENTS,
        payload: []
    });
};