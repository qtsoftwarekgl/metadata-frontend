import { fromJS } from 'immutable';
import {
  FETCH_TRANSFER_REQUEST_LIST_REQUEST,
  FETCH_TRANSFER_REQUEST_LIST_SUCCESS,
  FETCH_TRANSFER_REQUEST_LIST_ERROR,
  UPDATE_TRANSFER_REQ_REQUEST,
  UPDATE_TRANSFER_REQ_SUCCESS,
  UPDATE_TRANSFER_REQ_ERROR,
  UPDATE_TRANSFER_REQ_CLEAR
} from './constants';

export const initialState = fromJS({});

function transferRequestListReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRANSFER_REQUEST_LIST_REQUEST:
      return Object.assign({}, state, {
        listLoading: true
      });
    case UPDATE_TRANSFER_REQ_REQUEST:
      return Object.assign({}, state, {
        updateLoading: true
      });
    case FETCH_TRANSFER_REQUEST_LIST_SUCCESS:
      return Object.assign({}, state, {
        listLoading: false,
        transferRequestList: action.transferRequestList,
        count: action.count
      });
    case UPDATE_TRANSFER_REQ_SUCCESS:
      return Object.assign({}, state, {
        updateLoading: false,
        status: action.status,
        message: action.message
      });
    case UPDATE_TRANSFER_REQ_ERROR:
      return Object.assign({}, state, {
        updateLoading: false,
        updatedData: {},
        status: action.status,
        message: action.message
      });
    case FETCH_TRANSFER_REQUEST_LIST_ERROR:
      return Object.assign({}, state, {
        listLoading: false,
        error: true,
        transferRequestList: []
      });
    case UPDATE_TRANSFER_REQ_CLEAR:
      return Object.assign({}, state, {
        updateLoading: false,
        error: true,
        status: '',
        message: ''
      });
    default:
      return state;
  }
}

export default transferRequestListReducer;
