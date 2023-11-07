import {
  all, call, put, takeEvery, fork
} from 'redux-saga/effects';
import { UPDATE_USER_APPLICATION } from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  updateUserApplicationRequest,
  updateUserApplicationSuccess,
  updateUserApplicationError
} from './updateUserApplicationActions';

export function* updateUserApplicationAsync(action) {
  const { id, userData } = action.payload;
  const url = `${URL.USER_APPLICATIONS}/${id}`;
  try {
    yield put(updateUserApplicationRequest());
    const data = yield call(() => API.put(url, userData));
    yield put(updateUserApplicationSuccess(data));
  } catch (error) {
    yield put(updateUserApplicationError());
  }
}

function* updateUserApplicationRootSaga() {
  yield all([
    yield takeEvery(UPDATE_USER_APPLICATION, updateUserApplicationAsync)
  ]);
}

const updateUserApplicationSagas = [
  fork(updateUserApplicationRootSaga),
];

export default updateUserApplicationSagas;
