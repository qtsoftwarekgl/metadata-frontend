import { fromJS } from 'immutable';
import {
  FETCH_TRANSFER_LOGS_LIST_REQUEST,
  FETCH_TRANSFER_LOGS_LIST_SUCCESS,
  FETCH_TRANSFER_LOGS_LIST_ERROR,
} from './constants';

export const initialState = fromJS({});

function transferLogsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRANSFER_LOGS_LIST_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case FETCH_TRANSFER_LOGS_LIST_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        transferLogsList: action.transferLogsList,
        count: action.count
      });
    case FETCH_TRANSFER_LOGS_LIST_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    default:
      return state;
  }
}

export default transferLogsReducer;
