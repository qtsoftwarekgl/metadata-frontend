import {
  DELETE_USER,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
  DELETE_USER_CLEAR
} from './constants';

export function deleteUser(ids) {
  return {
    type: DELETE_USER,
    payload: ids
  };
}

export function deleteUserRequest() {
  return {
    type: DELETE_USER_REQUEST
  };
}

export function deleteUserSuccess(response) {
  let errorMessage = '';
  if (response.status === 'error') {
    errorMessage = response.message;
  }
  return {
    type: DELETE_USER_SUCCESS,
    userDeleted: response ? response.status : '',
    errorMessage
  };
}

export function deleteUserError(response) {
  let errorMessage = '';
  if (response.status === 'error') {
    errorMessage = response.message;
  }
  return {
    type: DELETE_USER_ERROR,
    errorMessage
  };
}

export function deleteUserClear() {
  return {
    type: DELETE_USER_CLEAR
  };
}
