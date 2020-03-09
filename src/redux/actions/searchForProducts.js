import axios from 'axios';
import { SEARCH_FOR_PRODUCTS, CLEAR_SEARCHED_PRODUCTS } from './reduxActions';
import { apiurl } from '../../constants/config';

export const searchForProducts = data => dispatch => {
    dispatch({
        type: "LOADING",
        loading: true
    });
    axios
        .post(`${apiurl}search-products.php`, data)
        .then(res => {
            // console.warn(res.data);
            if (res.data.status === 'success') {
                dispatch({
                    type: SEARCH_FOR_PRODUCTS,
                    payload: res.data.data
                });
            } else if (res.data.status === 'empty') {
                dispatch({
                    type: SEARCH_FOR_PRODUCTS,
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

export const clearSearchedProducts = () => dispatch => {
    dispatch({
        type: CLEAR_SEARCHED_PRODUCTS,
        payload: []
    });
};