import {
  all, call, put, takeEvery, fork
} from 'redux-saga/effects';
import _ from 'lodash';
import { FETCH_USER_APPLICATIONS_LIST } from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  fetchUserApplicationsRequest,
  fetchUserApplicationsSuccess,
  fetchUserApplicationsError
} from './userApplicationsListActions';

export function* fetchUserApplicationsAsync(action) {
  const params = _.pickBy(action.payload, _.identity);
  try {
    yield put(fetchUserApplicationsRequest());
    const data = yield call(() => API.get(URL.USER_APPLICATIONS, { params }));
    yield put(fetchUserApplicationsSuccess(data));
  } catch (error) {
    yield put(fetchUserApplicationsError());
  }
}

function* userApplicationsRootSaga() {
  yield all([
    yield takeEvery(FETCH_USER_APPLICATIONS_LIST, fetchUserApplicationsAsync)
  ]);
}

const userApplicationsSagas = [
  fork(userApplicationsRootSaga),
];

export default userApplicationsSagas;
