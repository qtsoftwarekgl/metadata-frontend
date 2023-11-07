import {
  all, call, put, takeEvery, fork
} from 'redux-saga/effects';
import { TRANSTER_REQUEST, TRANSTER_REQUEST_PENDING } from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  transferRequestRequest,
  transferRequestSuccess,
  transferRequestError,
  transferRequestPendingRequest,
  transferRequestPendingSuccess,
  transferRequestPendingError
} from './transferRequestActions';


export function* transferRequestAsync(action) {
  try {
    yield put(transferRequestRequest());
    const data = yield call(() => API.post(URL.TRANSFER, action.payload));
    yield put(transferRequestSuccess(data));
  } catch (error) {
    yield put(transferRequestError(error));
  }
}

export function* transferRequestPendingAsync(action) {
  const { id } = action.payload;
  const url = `${URL.TRANSFER_REQ_PENDING}/${id}`;
  try {
    yield put(transferRequestPendingRequest());
    let data;
    if (id) {
      data = yield call(() => API.get(url));
    } else {
      data = yield call(() => API.get(URL.TRANSFER_REQ_PENDING));
    }
    yield put(transferRequestPendingSuccess(data));
  } catch (error) {
    yield put(transferRequestPendingError(error));
  }
}


function* transferRequestRootSaga() {
  yield all([
    yield takeEvery(TRANSTER_REQUEST, transferRequestAsync),
    yield takeEvery(TRANSTER_REQUEST_PENDING, transferRequestPendingAsync)
  ]);
}

const transferRequestSagas = [
  fork(transferRequestRootSaga),
];

export default transferRequestSagas;
