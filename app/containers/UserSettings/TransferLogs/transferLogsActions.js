import moment from 'moment';
import {
  FETCH_TRANSFER_LOGS_LIST,
  FETCH_TRANSFER_LOGS_LIST_REQUEST,
  FETCH_TRANSFER_LOGS_LIST_SUCCESS,
  FETCH_TRANSFER_LOGS_LIST_ERROR
} from './constants';
import { DATE_FORMAT } from '../../../lib/constants';

export function fetchTransferLogsList(params) {
  return {
    type: FETCH_TRANSFER_LOGS_LIST,
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

export function fetchTransferLogsListRequest() {
  return {
    type: FETCH_TRANSFER_LOGS_LIST_REQUEST
  };
}

export function fetchTransferLogsListSuccess(response) {
  return {
    type: FETCH_TRANSFER_LOGS_LIST_SUCCESS,
    transferLogsList: response ? response.data : [],
    count: response ? response.count : 0
  };
}

export function fetchTransferLogsListError() {
  return {
    type: FETCH_TRANSFER_LOGS_LIST_ERROR
  };
}
