import moment from 'moment';
import {
  FETCH_USER_APPLICATIONS_LIST,
  FETCH_USER_APPLICATIONS_LIST_REQUEST,
  FETCH_USER_APPLICATIONS_LIST_SUCCESS,
  FETCH_USER_APPLICATIONS_LIST_ERROR
} from './constants';
import { DATE_FORMAT } from '../../../lib/constants';

export function fetchUserApplications(params) {
  return {
    type: FETCH_USER_APPLICATIONS_LIST,
    payload: {
      page: params.page || 1,
      limit: params.limit || 20,
      name: params.name || '',
      phoneNumber: params.phoneNumber || '',
      email: params.email || '',
      facilityName: params.facilityName || '',
      fromDate: params.fromDate ? moment(params.fromDate).format(DATE_FORMAT) : '',
      toDate: params.toDate ? moment(params.toDate).format(DATE_FORMAT) : '',
      facilityArea: params.facilityType || '',
      status: params.status || '',
    }
  };
}

export function fetchUserApplicationsRequest() {
  return {
    type: FETCH_USER_APPLICATIONS_LIST_REQUEST
  };
}

export function fetchUserApplicationsSuccess(response) {
  return {
    type: FETCH_USER_APPLICATIONS_LIST_SUCCESS,
    userApplications: response ? response.data : [],
    count: response ? response.count : 0
  };
}

export function fetchUserApplicationsError() {
  return {
    type: FETCH_USER_APPLICATIONS_LIST_ERROR
  };
}
