import axios from 'axios';
import { GENERAL_SEARCH, CLEAR_GENERAL_SEARCH } from './reduxActions';
import { apiurl } from '../../constants/config';

export const generalSearch = data => dispatch => {
    dispatch({
        type: "LOADING",
        loading: true
    });
    axios
        .post(`${apiurl}search-everything.php`, data)
        .then(res => {
            // console.warn(res.data);
            if (res.data.status === 'success') {
                dispatch({
                    type: GENERAL_SEARCH,
                    payload: res.data.data
                });
            } else if (res.data.status === 'empty') {
                dispatch({
                    type: GENERAL_SEARCH,
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

export const clearGeneralSearch = () => dispatch => {
    dispatch({
        type: CLEAR_GENERAL_SEARCH,
        payload: []
    });
};