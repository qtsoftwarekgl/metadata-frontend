import { fromJS } from 'immutable';
import {
  FETCH_USER_STATUS_LOGS_REQUEST,
  FETCH_USER_STATUS_LOGS_SUCCESS,
  FETCH_USER_STATUS_LOGS_ERROR,
  DATA_UPDATE_REQUEST,
  DATA_UPDATE_SUCCESS,
  DATA_UPDATE_ERROR
} from './constants';

export const initialState = fromJS({});

function userStatusLogsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_STATUS_LOGS_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case FETCH_USER_STATUS_LOGS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        userStatusLogsList: action.userStatusLogsList,
        count: action.count
      });
    case FETCH_USER_STATUS_LOGS_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    case DATA_UPDATE_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case DATA_UPDATE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        updateDataStatus: action.updateDataStatus,
        errorMessage: action.errorMessage
      });
    case DATA_UPDATE_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: true,
        updateDataStatus: action.updateDataStatus,
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
}

export default userStatusLogsReducer;
