import axios from 'axios';
import { SEARCH_CASTING_CALLS, CLEAR_CALL_SEARCH } from './reduxActions';
import { apiurl } from '../../constants/config';

export const searchForCalls = data => dispatch => {
    dispatch({
        type: "LOADING",
        loading: true
    });
    axios
        .post(`${apiurl}fetch-casting-calls.php`, data)
        .then(res => {
            // console.warn(res.data);
            if (res.data.status === 'success') {
                dispatch({
                    type: SEARCH_CASTING_CALLS,
                    payload: res.data.casting_calls
                });
            } else if (res.data.status === 'empty') {
                dispatch({
                    type: SEARCH_CASTING_CALLS,
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

export const clearCallSearch = () => dispatch => {
    dispatch({
        type: CLEAR_CALL_SEARCH,
        payload: []
    });
};