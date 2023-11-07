import {
  all, call, put, takeEvery, fork
} from 'redux-saga/effects';
import { DELETE_USER } from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserError
} from './deleteUserActions';

export function* deleteUserAsync(action) {
  const url = `${URL.DELETE_USERS}`;
  try {
    yield put(deleteUserRequest());
    const data = yield call(() => API.delete(url, { data: { ids: action.payload } }));
    yield put(deleteUserSuccess(data));
  } catch (error) {
    yield put(deleteUserError(error));
  }
}

function* deleteUserRootSaga() {
  yield all([
    yield takeEvery(DELETE_USER, deleteUserAsync)
  ]);
}

const deleteUserSagas = [
  fork(deleteUserRootSaga),
];

export default deleteUserSagas;
