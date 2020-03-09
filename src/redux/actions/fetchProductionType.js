import axios from 'axios';
import {
  FETCH_PRODUCTION_TYPE,
  FETCH_PRODUCT_TYPE,
  FETCH_SERVICE_TYPE,
} from './reduxActions';
import {apiurl} from '../../constants/config';

// eslint-disable-next-line import/prefer-default-export
export const fetchProductionType = () => dispatch => {
  axios
    .get(`${apiurl}fetch-production-type.php`)
    .then(res => {
      dispatch({
        type: FETCH_PRODUCTION_TYPE,
        payload: res.data.data,
      });
    })
    .catch(res => console.log(res.data));
};

export const fetchProductType = () => dispatch => {
  axios
    .get(`${apiurl}fetch-product-type.php`)
    .then(res => {
      dispatch({
        type: FETCH_PRODUCT_TYPE,
        payload: res.data.data,
      });
    })
    .catch(res => console.log(res.data));
};

export const fetchServiceType = () => dispatch => {
  axios
    .get(`${apiurl}fetch-service-type.php`)
    .then(res => {
      // console.warn(res.data);
      dispatch({
        type: FETCH_SERVICE_TYPE,
        payload: res.data.data,
      });
    })
    .catch(res => console.log(res.data));
};
