import axios from 'axios';
import {FETCH_USER_FOLLOWERS} from './reduxActions';
import {apiurl} from '../../constants/config';

// eslint-disable-next-line import/prefer-default-export
export const fetchuserfollowers = (data, status, members) => dispatch => {
  axios
    .get(`${apiurl}fetch-user-followers.php?user_id=${data}`)
    .then(res => {
      console.warn('API data fetch-user-followers.php : ', res.data);
      if (status || members) {
        if (res.data.status == 'success') {
          var newItem = [];

          res.data.data.forEach(item => {
            // console.log("New Data : ",item);
            var isContain = false;
            members.forEach(item2 => {
              if (item.id == item2.id) {
                isContain = true;
              }
            });
            if (!isContain) {
              newItem.push({
                id: item.id,
                full_name: item.full_name,
                profile_thumb:
                  item.profile_thumb == ''
                    ? 'https://pngimage.net/wp-content/uploads/2018/06/user-png-image-5.png'
                    : item.profile_thumb,
                username: item.username,
                rating: item.rating,
                follow_status: item.follow_status,
                isAdmin: status,
              });
            }
          });

          var newResponce = {
            status: 'success',
            data: newItem,
          };
          console.log('New Response : ', newResponce);
          dispatch({
            type: FETCH_USER_FOLLOWERS,
            payload: newResponce,
          });
        } else {
          dispatch({
            type: FETCH_USER_FOLLOWERS,
            payload: res.data,
          });
        }
      } else {
        if (res.data.status === 'success') {
          dispatch({
            type: FETCH_USER_FOLLOWERS,
            payload: res.data,
          });
        }
      }
    })
    .catch(res => console.log(res.data));
};
