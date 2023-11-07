import { fromJS } from 'immutable';
import {
  UPDATE_USER_APPLICATION_REQUEST,
  UPDATE_USER_APPLICATION_SUCCESS,
  UPDATE_USER_APPLICATION_ERROR,
  UPDATE_USER_APPLICATION_CLEAR
} from './constants';

export const initialState = fromJS({});

function updateUserApplicationReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_APPLICATION_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case UPDATE_USER_APPLICATION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        userApplicationUpdated: action.userApplicationUpdated
      });
    case UPDATE_USER_APPLICATION_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    case UPDATE_USER_APPLICATION_CLEAR:
      return Object.assign({}, state, {
        loading: false,
        error: true,
        userApplicationUpdated: ''
      });
    default:
      return state;
  }
}

export default updateUserApplicationReducer;
