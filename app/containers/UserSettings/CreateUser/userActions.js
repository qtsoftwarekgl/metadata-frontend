import {
  CREATE_NEW_USER,
  CREATE_NEW_USER_REQUEST,
  CREATE_NEW_USER_SUCCESS,
  CREATE_NEW_USER_ERROR,
  CREATE_NEW_USER_CLEAR
} from './constants';


export function createNewUser(userData, usertype) {
  return {
    type: CREATE_NEW_USER,
    payload: userData,
    usertype
  };
}

export function createNewUserRequest() {
  return {
    type: CREATE_NEW_USER_REQUEST
  };
}

export function createNewUserSuccess(response) {
  return {
    type: CREATE_NEW_USER_SUCCESS,
    userCreated: response ? response.status : '',
    message: response ? response.message : ''
  };
}

export function createNewUserError() {
  return {
    type: CREATE_NEW_USER_ERROR
  };
}

export function createNewUserClear() {
  return {
    type: CREATE_NEW_USER_CLEAR
  };
}
