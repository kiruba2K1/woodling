import axios from 'axios';
import {FETCH_FAVORITED_PRODUCTS} from './reduxActions';
import {apiurl} from '../../constants/config';

// eslint-disable-next-line import/prefer-default-export
export const fetchFavoritedProducts = data => dispatch => {
  dispatch({
    type: 'LOADING',
    payload: true,
  });
  axios
    .get(`${apiurl}fetch-favorited-products.php?user_id=${data.user_id}`)
    .then(res => {
      console.warn(res.data);
      dispatch({
        type: FETCH_FAVORITED_PRODUCTS,
        payload: res.data.favorite_products,
      });
    })
    .catch(res => console.log(res.data));
  dispatch({
    type: 'LOADING',
    payload: false,
  });
};
