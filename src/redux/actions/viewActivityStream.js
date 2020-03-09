import axios from 'axios';
import { VIEW_ACTIVITY_STREAM, CLEAR_ACTIVITY_STREAM } from './reduxActions';
import { apiurl } from '../../constants/config';
0
// eslint-disable-next-line import/prefer-default-export
export const viewActivityStream = data => dispatch => {
  console.log("Request Data : ",data);
  dispatch({
    type: "LOADING",
    loading:true
  });
  axios
    .post(`${apiurl}view-activity-stream.php`, data)
    .then(res => {
      console.log("Response Data: ",res);
      if (res.data.status === 'success') {
        // console.log(res.data.data);
        dispatch({
          type: VIEW_ACTIVITY_STREAM,
          payload: res.data.data
        });
      } else if (res.data.status === 'empty') {
        // console.log(res.data);
        dispatch({
          type: VIEW_ACTIVITY_STREAM,
          payload: []
        });
      }
      dispatch({
        type: "LOADING",
        loading:false
      });
    })
    .catch(res => {
      console.log("Error Data : ",res)
      dispatch({
        type: "LOADING",
        loading:false
      });
    });
};

export const clearActivityStream = () => dispatch => {
  dispatch({
    type: CLEAR_ACTIVITY_STREAM,
    payload: []
  });
};
