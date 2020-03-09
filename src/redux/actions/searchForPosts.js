import axios from 'axios';
import { SEARCH_FOR_POSTS, CLEAR_SEARCHED_POSTS } from './reduxActions';
import { apiurl } from '../../constants/config';

export const searchForPosts = data => dispatch => {
    dispatch({
        type: "LOADING",
        loading: true
    });
    axios
        .post(`${apiurl}search-posts.php`, data)
        .then(res => {
            // console.warn(res.data);
            if (res.data.status === 'success') {
                dispatch({
                    type: SEARCH_FOR_POSTS,
                    payload: res.data.data
                });
            } else if (res.data.status === 'empty') {
                dispatch({
                    type: SEARCH_FOR_POSTS,
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

export const clearPosts = () => dispatch => {
    dispatch({
        type: CLEAR_SEARCHED_POSTS,
        payload: []
    });
};