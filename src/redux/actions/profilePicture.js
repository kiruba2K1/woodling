import {PROFILE_PICTURE, GET_USERNAME, GET_EMAIL} from './reduxActions';

// eslint-disable-next-line import/prefer-default-export
export const profilePicture = selected => dispatch => {
  dispatch({
    type: PROFILE_PICTURE,
    payload: selected,
  });
};

export const getUsername = selected => dispatch => {
  dispatch({
    type: GET_USERNAME,
    payload: selected,
  });
};

export const getEmail = selected => dispatch => {
  dispatch({
    type: GET_EMAIL,
    payload: selected,
  });
};
