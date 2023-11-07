import {
  all, call, put, takeEvery, fork
} from 'redux-saga/effects';
import {
  FETCH_TRANSFER_REQUEST_LIST,
  UPDATE_TRANSFER_REQUEST
} from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  fetchTransferListRequest,
  fetchTransferListSuccess,
  fetchTransferListError,
  updateTransferDataRequest,
  updateTransferRequestSuccess,
  updateTransferRequestError
} from './transferRequestActions';

export function* fetchTransferRequestListAsync(action) {
  const {
    page,
    limit,
    name,
    currentFacilityName,
    fromDate,
    toDate,
    status
  } = action.payload;

  let url = `${URL.TRANSFER}?page=${page}&limit=${limit}`;
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
    yield put(fetchTransferListRequest());
    const data = yield call(() => API.get(url));
    yield put(fetchTransferListSuccess(data));
  } catch (error) {
    yield put(fetchTransferListError());
  }
}

export function* updateTransferRequestAsync(action) {
  const { id, updateData } = action.payload;
  const url = `${URL.TRANSFER}/${id}`;
  try {
    yield put(updateTransferDataRequest());
    const data = yield call(() => API.put(url, updateData));
    yield put(updateTransferRequestSuccess(data));
  } catch (error) {
    yield put(updateTransferRequestError());
  }
}

function* transferRequestRootSaga() {
  yield all([
    yield takeEvery(FETCH_TRANSFER_REQUEST_LIST, fetchTransferRequestListAsync),
    yield takeEvery(UPDATE_TRANSFER_REQUEST, updateTransferRequestAsync)
  ]);
}

const transferRequestListSaga = [
  fork(transferRequestRootSaga),
];

export default transferRequestListSaga;
