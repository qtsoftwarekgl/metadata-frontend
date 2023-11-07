import {
  all, call, put, takeEvery, fork
} from 'redux-saga/effects';
import { FETCH_USER_LIST, WORKER_LOGS_HISTORY, USER_COUNT } from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  fetchUserListRequest,
  fetchUserListSuccess,
  fetchUserListError,
  workerLogHistoryListRequest,
  workerLogHistoryListSuccess,
  workerLogHistoryListError,
  userCountRequest,
  userCountSuccess,
  userCountError
} from './userListActions';

export function* fetchUserListAsync(action) {
  const {
    page,
    limit,
    file_name,
    focaid,
    version,
    facilityName
    // name,
    // email,
    // role,
    // facilityName,
    // ministry,
    // status
  } = action.payload;

  let url = `${URL.USERS}?page=${page}&limit=${limit}`;
  if (file_name) {
    url = `${url}&file_name=${file_name}`;
  }
  if (focaid) {
    url = `${url}&focaid=${focaid}`;
  }
    if (version) {
    url = `${url}&version=${version}`;
  }
  if (facilityName) {
    url = `${url}&facilityName=${facilityName}`;
  }
  // if (name) {
  //   url = `${url}&name=${name}`;
  // }
  // if (email) {
  //   url = `${url}&email=${email}`;
  // }
  // if (role) {
  //   url = `${url}&role=${role}`;
  // }
  // if (facilityName) {
  //   url = `${url}&facilityName=${facilityName}`;
  // }
  // if (ministry) {
  //   url = `${url}&ministry=${ministry}`;
  // }
  // if (status) {
  //   url = `${url}&status=${status}`;
  // }

  try {
    yield put(fetchUserListRequest());
    const data = yield call(() => API.get(url));
    console.log("first",data)
    yield put(fetchUserListSuccess(data));
  } catch (error) {
    yield put(fetchUserListError());
  }
}

export function* fetchWorkerLogsHistoryListAsync(action) {
  const {
    id,
    page,
    limit
  } = action.payload;

  const url = `${URL.WORKER_LOG_HISTORY}/${id}?page=${page}&limit=${limit}`;
  try {
    yield put(workerLogHistoryListRequest());
    const data = yield call(() => API.get(url));
    yield put(workerLogHistoryListSuccess(data));
  } catch (error) {
    yield put(workerLogHistoryListError());
  }
}

export function* userCountAsync() {
  try {
    yield put(userCountRequest());
    const res = yield call(() => API.get(URL.USER_APPLICATIONS_COUNT));
    yield put(userCountSuccess(res));
  } catch (error) {
    yield put(userCountError());
  }
}

function* userListRootSaga() {
  yield all([
    yield takeEvery(FETCH_USER_LIST, fetchUserListAsync),
    // yield takeEvery(WORKER_LOGS_HISTORY, fetchWorkerLogsHistoryListAsync),
    // yield takeEvery(USER_COUNT, userCountAsync)
  ]);
}

const userListSagas = [
  fork(userListRootSaga),
];

export default userListSagas;
