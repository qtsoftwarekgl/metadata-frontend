import moment from 'moment';
import {
  FETCH_USER_STATUS_LOGS,
  FETCH_USER_STATUS_LOGS_REQUEST,
  FETCH_USER_STATUS_LOGS_SUCCESS,
  FETCH_USER_STATUS_LOGS_ERROR,
  DATA_UPDATE,
  DATA_UPDATE_REQUEST,
  DATA_UPDATE_SUCCESS,
  DATA_UPDATE_ERROR
} from './constants';
import { DATE_FORMAT } from '../../../lib/constants';

export function fetchUserStatusLogsList(params) {
  return {
    type: FETCH_USER_STATUS_LOGS,
    payload: {
      page: params.page || 1,
      limit: params.limit || 20,
      // name: params.name || '',
      // fromDate: params.fromDate ? moment(params.fromDate).format(DATE_FORMAT) : '',
      // toDate: params.toDate ? moment(params.toDate).format(DATE_FORMAT) : '',
      // documentNumber: params.documentNumber || '',
      // email: params.email || '',
      file_name:params.file_name || '',
      version:params.version || '',
      release_note:params.release_note || '',
      status: params.status || ''
    }
  };
}

export function fetchUserStatusLogsListRequest() {
  return {
    type: FETCH_USER_STATUS_LOGS_REQUEST
  };
}

export function fetchUserStatusLogsListSuccess(response) {
  return {
    type: FETCH_USER_STATUS_LOGS_SUCCESS,
    userStatusLogsList: response ? response.data.results : [],
    count: response ? response.data.count : 0
  };
}

export function fetchUserStatusLogsListError() {
  return {
    type: FETCH_USER_STATUS_LOGS_ERROR
  };
}

export function updateData(id, data) {
  const topic = data;
  delete topic.id;
  return {
    type: DATA_UPDATE,
    payload: topic,
    id
  };
}

export function updateDataRequest() {
  return {
    type: DATA_UPDATE_REQUEST
  };
}

export function updateDataSuccess(response) {
  let errorMessage = '';
  if (response.status === 'error') {
    errorMessage = response.message;
  }
  return {
    type: DATA_UPDATE_SUCCESS,
    updateDataStatus: response.message,
    errorMessage
  };
}

export function updateDataError(response) {
  let errorMessage = '';
  if (response.status === 'error') {
    errorMessage = response.message;
  }
  return {
    type: DATA_UPDATE_ERROR,
    updateDataStatus: 'error',
    errorMessage
  };
}