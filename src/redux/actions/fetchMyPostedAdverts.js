import axios from 'axios';
import {FETCH_MY_POSTED_ADVERTS} from './reduxActions';
import {apiurl} from '../../constants/config';

// eslint-disable-next-line import/prefer-default-export
export const fetchMyPostedAdverts = data => dispatch => {
  dispatch({
    type: 'LOADING',
    payload: true,
  });
  axios
    .get(`${apiurl}fetch-my-posted-adverts.php?user_id=${data.user_id}`)
    .then(res => {
      dispatch({
        type: FETCH_MY_POSTED_ADVERTS,
        payload: res.data.posted_adverts,
      });
    })
    .catch(res => console.log(res.data));
  dispatch({
    type: 'LOADING',
    payload: false,
  });
};
