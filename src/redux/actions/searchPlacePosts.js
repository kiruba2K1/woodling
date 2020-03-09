import axios from 'axios';
import { SEARCH_PLACE_POSTS, CLEAR_PLACE_POSTS } from './reduxActions';
import { apiurl } from '../../constants/config';

export const searchPlacePosts = data => dispatch => {
    dispatch({
        type: "LOADING",
        loading: true
    });
    axios
        .post(`${apiurl}search-place-everything.php`, data)
        .then(res => {
            // console.warn(res.data);
            if (res.data.status === 'success') {
                dispatch({
                    type: SEARCH_PLACE_POSTS,
                    payload: res.data.data
                });
            } else if (res.data.status === 'empty') {
                dispatch({
                    type: SEARCH_PLACE_POSTS,
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

export const clearPlacePosts = () => dispatch => {
    dispatch({
        type: CLEAR_PLACE_POSTS,
        payload: []
    });
};