import {
  ADD_POST_LOCATION,
  ADD_POST_TAG,
  POST_VALUES,
  CLEAR_TAGGED_PEOPLE,
  CLEAR_POST_LOCATION,
} from './reduxActions';

// eslint-disable-next-line import/prefer-default-export
export const addlocation = location => dispatch => {
  dispatch({
    type: ADD_POST_LOCATION,
    payload: location,
  });
};

export const tagPeople = people => dispatch => {
  dispatch({
    type: ADD_POST_TAG,
    payload: people,
  });
};

export const postValues = data => dispatch => {
  dispatch({
    type: POST_VALUES,
    payload: data,
  });
};

export const cleartaggedPeople = people => dispatch => {
  dispatch({
    type: CLEAR_TAGGED_PEOPLE,
    payload: [],
  });
};

export const clearPostLocation = people => dispatch => {
  dispatch({
    type: CLEAR_POST_LOCATION,
    payload: [],
  });
};
