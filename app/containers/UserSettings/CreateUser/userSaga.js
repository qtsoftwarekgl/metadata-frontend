import {
  all, call, put, takeEvery, fork
} from 'redux-saga/effects';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import { CREATE_NEW_USER } from './constants';
import {
  createNewUserRequest,
  createNewUserSuccess,
  createNewUserError
} from './userActions';

export function* fetchCitizenAsync(action) {
  const url = action.usertype === 'SUPER_ADMIN' ? URL.CREATE_ADMIN : URL.USERS;
  try {
    yield put(createNewUserRequest());
    const data = yield call(() => API.post(url, action.payload));
    yield put(createNewUserSuccess(data));
  } catch (error) {
    yield put(createNewUserError());
  }
}

function* userRootSaga() {
  yield all([
    yield takeEvery(CREATE_NEW_USER, fetchCitizenAsync)
  ]);
}

const userSagas = [
  fork(userRootSaga),
];

export default userSagas;
