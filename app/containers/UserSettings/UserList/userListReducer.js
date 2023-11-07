import { fromJS } from 'immutable';
import {
  FETCH_USER_LIST_REQUEST,
  FETCH_USER_LIST_SUCCESS,
  FETCH_USER_LIST_ERROR,
  WORKER_LOGS_HISTORY_REQUEST,
  WORKER_LOGS_HISTORY_SUCCESS,
  WORKER_LOGS_HISTORY_ERROR,
  USER_COUNT_REQUEST,
  USER_COUNT_SUCCESS,
  USER_COUNT_ERROR
} from './constants';

export const initialState = fromJS({});

function userListReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_LIST_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case FETCH_USER_LIST_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        userList: action.userList,
        count: action.count
      });
    case FETCH_USER_LIST_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    case WORKER_LOGS_HISTORY_REQUEST:
      return Object.assign({}, state, {
        workerLogsLoading: true
      });
    case WORKER_LOGS_HISTORY_SUCCESS:
      return Object.assign({}, state, {
        workerLogsLoading: false,
        workerHistoryList: action.workerHistoryList,
        workerLogsCount: action.count
      });
    case WORKER_LOGS_HISTORY_ERROR:
      return Object.assign({}, state, {
        workerLogsLoading: false,
        error: true
      });
    case USER_COUNT_REQUEST:
      return Object.assign({}, state, {
        userCountLoading: true
      });
    case USER_COUNT_SUCCESS:
      return Object.assign({}, state, {
        userCountLoading: false,
        userCount: action.count
      });
    case USER_COUNT_ERROR:
      return Object.assign({}, state, {
        userCountLoading: false,
        error: true
      });
    default:
      return state;
  }
}

export default userListReducer;
