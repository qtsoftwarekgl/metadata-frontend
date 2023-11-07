import {
  all, call, put, takeEvery, fork
} from 'redux-saga/effects';
import { FETCH_USER_STATUS_LOGS, DATA_UPDATE } from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  fetchUserStatusLogsListRequest,
  fetchUserStatusLogsListSuccess,
  fetchUserStatusLogsListError,
  updateDataRequest,
  updateDataSuccess,
  updateDataError,
} from './userStatusLogsAction';


export function* fetchUserStatusLogsListAsync(action) {
  const {
    page,
    limit,
    name,
    documentNumber,
    email,
    fromDate,
    toDate,
    file_name,
    version,
    release_note,
    status
  } = action.payload;

  let url = `${URL.USER_STATUS_LOGS}?page=${page}&limit=${limit}`;
  // if (name) {
  //   url = `${url}&name=${name}`;
  // }
  // if (documentNumber) {
  //   url = `${url}&documentNumber=${documentNumber}`;
  // }
  // if (email) {
  //   url = `${url}&email=${email}`;
  // }
  // if (fromDate) {
  //   url = `${url}&fromDate=${fromDate}`;
  // }
  // if (toDate) {
  //   url = `${url}&toDate=${toDate}`;
  // }
  if (file_name) {
    url = `${url}&file_name=${file_name}`;
  }
  if (release_note) {
    url = `${url}&release_note=${release_note}`;
  }
  if (version) {
    url = `${url}&version=${version}`;
  }
  if (status) {
    url = `${url}&status=${status}`;
  }

  try {
    yield put(fetchUserStatusLogsListRequest());
    const data = yield call(() => API.get(url));
    // console.log("data",data)
    yield put(fetchUserStatusLogsListSuccess(data));
  } catch (error) {
    yield put(fetchUserStatusLogsListError());
  }
}
export function* updateDataAsync(action) {
  // console.log("action",action)
  try {
    yield put(updateDataRequest());
    const data = yield call(() => API.put(`${URL.DUMP_EDIT}/${action.id}`, action.payload));
    // console.log("data",data)
    yield put(updateDataSuccess(data));
  } catch (error) {
    yield put(updateDataError(error));
  }
}

function* userStatusLogsRootSaga() {
  yield all([
    yield takeEvery(FETCH_USER_STATUS_LOGS, fetchUserStatusLogsListAsync),
    yield takeEvery(DATA_UPDATE, updateDataAsync),
  ]);
}

const userStatusLogsSaga = [
  fork(userStatusLogsRootSaga),
];

export default userStatusLogsSaga;
