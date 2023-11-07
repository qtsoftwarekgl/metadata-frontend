import { fromJS } from 'immutable';
import {
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
  DELETE_USER_CLEAR
} from './constants';

export const initialState = fromJS({});

function deleteUserReducer(state = initialState, action) {
  switch (action.type) {
    case DELETE_USER_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case DELETE_USER_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        userDeleted: action.userDeleted,
        errorMessage: action.errorMessage
      });
    case DELETE_USER_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: true,
        errorMessage: action.errorMessage
      });
    case DELETE_USER_CLEAR:
      return Object.assign({}, state, {
        loading: false,
        error: true,
        userDeleted: '',
        errorMessage: ''
      });
    default:
      return state;
  }
}

export default deleteUserReducer;
