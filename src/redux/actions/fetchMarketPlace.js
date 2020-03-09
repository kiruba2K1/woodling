import axios from 'axios';
import {FETCH_MARKET_PLACE, CLEAR_MARKET_PLACE} from './reduxActions';
import {apiurl} from '../../constants/config';

// eslint-disable-next-line import/prefer-default-export
export const fetchMarketPlace = data => dispatch => {
  dispatch({
    type: 'LOADING',
    loading: true,
  });
  axios
    .get(`${apiurl}fetch-all-products?user_id=${user_id}&page=1`)
    .then(res => {
      console.warn(res.data);
      if (res.data.status === 'success') {
        // console.log(res.data.data);
        dispatch({
          type: FETCH_MARKET_PLACE,
          payload: res.data.data,
        });
      } else if (res.data.status === 'empty') {
        // console.log(res.data);
        dispatch({
          type: FETCH_MARKET_PLACE,
          payload: [],
        });
      }
    })
    .catch(res => console.log(res.data));
  dispatch({
    type: 'LOADING',
    loading: false,
  });
};

export const clearActivityStream = () => dispatch => {
  dispatch({
    type: CLEAR_ACTIVITY_STREAM,
    payload: [],
  });
};
