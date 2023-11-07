import moment from 'moment';
import {
  FETCH_TRANSFER_REQUEST_LIST,
  FETCH_TRANSFER_REQUEST_LIST_REQUEST,
  FETCH_TRANSFER_REQUEST_LIST_SUCCESS,
  FETCH_TRANSFER_REQUEST_LIST_ERROR,
  UPDATE_TRANSFER_REQUEST,
  UPDATE_TRANSFER_REQ_REQUEST,
  UPDATE_TRANSFER_REQ_SUCCESS,
  UPDATE_TRANSFER_REQ_ERROR,
  UPDATE_TRANSFER_REQ_CLEAR
} from './constants';
import { DATE_FORMAT } from '../../../lib/constants';


export function fetchTransferRequestList(params) {
  return {
    type: FETCH_TRANSFER_REQUEST_LIST,
    payload: {
      page: params.page || 1,
      limit: params.limit || 20,
      name: params.name || '',
      currentFacilityName: params.currentFacilityName || '',
      fromDate: params.fromDate ? moment(params.fromDate).format(DATE_FORMAT) : '',
      toDate: params.toDate ? moment(params.toDate).format(DATE_FORMAT) : '',
      status: params.status || ''
    }
  };
}

export function fetchTransferListRequest() {
  return {
    type: FETCH_TRANSFER_REQUEST_LIST_REQUEST
  };
}

export function fetchTransferListSuccess(response) {
  return {
    type: FETCH_TRANSFER_REQUEST_LIST_SUCCESS,
    transferRequestList: response ? response.data : [],
    count: response ? response.count : 0
  };
}

export function fetchTransferListError() {
  return {
    type: FETCH_TRANSFER_REQUEST_LIST_ERROR
  };
}

export function updateTransferData(id, updateData) {
  return {
    type: UPDATE_TRANSFER_REQUEST,
    payload: { id, updateData }
  };
}

export function updateTransferDataRequest() {
  return {
    type: UPDATE_TRANSFER_REQ_REQUEST
  };
}

export function updateTransferRequestSuccess(response) {
  return {
    type: UPDATE_TRANSFER_REQ_SUCCESS,
    status: response ? response.status : '',
    message: response ? response.message : ''
  };
}

export function updateTransferRequestError() {
  return {
    type: UPDATE_TRANSFER_REQ_ERROR
  };
}

export function updateTransferRequestClear() {
  return {
    type: UPDATE_TRANSFER_REQ_CLEAR
  };
}
