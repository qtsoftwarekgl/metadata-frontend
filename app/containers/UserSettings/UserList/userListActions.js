import {
  FETCH_USER_LIST,
  FETCH_USER_LIST_REQUEST,
  FETCH_USER_LIST_SUCCESS,
  FETCH_USER_LIST_ERROR,
  WORKER_LOGS_HISTORY,
  WORKER_LOGS_HISTORY_REQUEST,
  WORKER_LOGS_HISTORY_SUCCESS,
  WORKER_LOGS_HISTORY_ERROR,
  USER_COUNT,
  USER_COUNT_REQUEST,
  USER_COUNT_SUCCESS,
  USER_COUNT_ERROR

} from './constants';


export function fetchUserList(params) {
  return {
    type: FETCH_USER_LIST,
    payload: {
      page: params.page || 1,
      limit: params.limit || 20,
      file_name: params.fileName || '',
      focaid: params.focaid || '',
      version: params.version || '',
      facilityName: params.facilityName || '',
      // name: params.name || '',
      // email: params.email || '',
      // role: params.role || '',
      // facilityName: params.facilityName || '',
      // ministry: params.ministry || '',
      // status: params.status || ''
    }
  };
}

export function fetchUserListRequest() {
  return {
    type: FETCH_USER_LIST_REQUEST
  };
}

export function fetchUserListSuccess(response) {
  return {
    type: FETCH_USER_LIST_SUCCESS,
    userList: response ? response.data.results : [],
    count: response ? response.data.count : 0
  };
}

export function fetchUserListError() {
  return {
    type: FETCH_USER_LIST_ERROR
  };
}

export function workerLogHistoryList(id, params) {
  return {
    type: WORKER_LOGS_HISTORY,
    payload: {
      id,
      page: params.page || 1,
      limit: params.limit || 20
    }
  };
}

export function workerLogHistoryListRequest() {
  return {
    type: WORKER_LOGS_HISTORY_REQUEST
  };
}

export function workerLogHistoryListSuccess(response) {
  return {
    type: WORKER_LOGS_HISTORY_SUCCESS,
    workerHistoryList: response ? response.data : [],
    count: response ? response.count : 0
  };
}

export function workerLogHistoryListError() {
  return {
    type: WORKER_LOGS_HISTORY_ERROR
  };
}

export function userCount() {
  return {
    type: USER_COUNT
  };
}

export function userCountRequest() {
  return {
    type: USER_COUNT_REQUEST
  };
}

export function userCountSuccess(res) {
  return {
    type: USER_COUNT_SUCCESS,
    count: res ? res.data : 0
  };
}

export function userCountError() {
  return {
    type: USER_COUNT_ERROR
  };
}
