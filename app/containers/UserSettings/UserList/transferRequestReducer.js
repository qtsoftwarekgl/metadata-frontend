import { fromJS } from 'immutable';
import {
  TRANSTER_REQUEST_REQUEST,
  TRANSTER_REQUEST_SUCCESS,
  TRANSTER_REQUEST_ERROR,
  TRANSTER_REQUEST_CLEAR,
  TRANSTER_REQUEST_PENDING_REQUEST,
  TRANSTER_REQUEST_PENDING_SUCCESS,
  TRANSTER_REQUEST_PENDING_ERROR,
  TRANSTER_REQUEST_PENDING_CLEAR
} from './constants';

export const initialState = fromJS({});

function transferRequestReducer(state = initialState, action) {
  switch (action.type) {
    case TRANSTER_REQUEST_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case TRANSTER_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        transferRequestCreated: action.transferRequestCreated,
        errorMessage: action.errorMessage
      });
    case TRANSTER_REQUEST_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: true,
        errorMessage: action.errorMessage
      });
    case TRANSTER_REQUEST_CLEAR:
      return Object.assign({}, state, {
        loading: false,
        error: true,
        transferRequestCreated: '',
        errorMessage: ''
      });
    case TRANSTER_REQUEST_PENDING_REQUEST:
      return Object.assign({}, state, {
        transferPendingLoading: true
      });
    case TRANSTER_REQUEST_PENDING_SUCCESS:
      return Object.assign({}, state, {
        transferPendingLoading: false,
        transferReqPending: action.transferReqPending,
        transferReqPendingStatus: action.status,
        transferReqPendingMessage: action.message,
        errorMessage: action.errorMessage
      });
    case TRANSTER_REQUEST_PENDING_ERROR:
      return Object.assign({}, state, {
        transferPendingLoading: false,
        error: true,
        transferReqPendingStatus: action.status,
        errorMessage: action.errorMessage
      });
    case TRANSTER_REQUEST_PENDING_CLEAR:
      return Object.assign({}, state, {
        transferPendingLoading: false,
        error: true,
        transferReqPending: '',
        transferReqPendingStatus: '',
        transferReqPendingMessage: '',
        errorMessage: ''
      });
    default:
      return state;
  }
}

export default transferRequestReducer;
