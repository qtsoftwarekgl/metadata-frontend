import {
  all, call, put, takeEvery, fork
} from 'redux-saga/effects';
import { FETCH_TRANSFER_LOGS_LIST } from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  fetchTransferLogsListRequest,
  fetchTransferLogsListSuccess,
  fetchTransferLogsListError
} from './transferLogsActions';


export function* fetchTransferLogsListAsync(action) {
  const {
    page,
    limit,
    name,
    currentFacilityName,
    fromDate,
    toDate,
    status
  } = action.payload;

  let url = `${URL.TRANSFER_LOGS}?page=${page}&limit=${limit}`;
  if (name) {
    url = `${url}&name=${name}`;
  }
  if (currentFacilityName) {
    url = `${url}&currentFacilityName=${currentFacilityName}`;
  }
  if (fromDate) {
    url = `${url}&fromDate=${fromDate}`;
  }
  if (toDate) {
    url = `${url}&toDate=${toDate}`;
  }
  if (status) {
    url = `${url}&status=${status}`;
  }

  try {
    yield put(fetchTransferLogsListRequest());
    const data = yield call(() => API.get(url));
    yield put(fetchTransferLogsListSuccess(data));
  } catch (error) {
    yield put(fetchTransferLogsListError());
  }
}

function* transferLogsRootSaga() {
  yield all([
    yield takeEvery(FETCH_TRANSFER_LOGS_LIST, fetchTransferLogsListAsync),
  ]);
}

const transferLogsListSaga = [
  fork(transferLogsRootSaga),
];

export default transferLogsListSaga;
