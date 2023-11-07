import { fromJS } from 'immutable';
import {
  CREATE_NEW_USER_REQUEST,
  CREATE_NEW_USER_SUCCESS,
  CREATE_NEW_USER_ERROR,
  CREATE_NEW_USER_CLEAR
} from './constants';

export const initialState = fromJS({});

function userReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_NEW_USER_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case CREATE_NEW_USER_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        userCreated: action.userCreated,
        message: action.message
      });
    case CREATE_NEW_USER_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    case CREATE_NEW_USER_CLEAR:
      return Object.assign({}, state, {
        userCreated: '',
        message: ''
      });
    default:
      return state;
  }
}

export default userReducer;
