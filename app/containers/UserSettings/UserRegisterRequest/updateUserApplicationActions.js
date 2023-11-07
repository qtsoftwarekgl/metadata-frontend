import {
  UPDATE_USER_APPLICATION,
  UPDATE_USER_APPLICATION_REQUEST,
  UPDATE_USER_APPLICATION_SUCCESS,
  UPDATE_USER_APPLICATION_ERROR,
  UPDATE_USER_APPLICATION_CLEAR
} from './constants';

export function updateUserApplication(id, userData) {
  return {
    type: UPDATE_USER_APPLICATION,
    payload: {
      id,
      userData
    }
  };
}

export function updateUserApplicationRequest() {
  return {
    type: UPDATE_USER_APPLICATION_REQUEST
  };
}

export function updateUserApplicationSuccess(response) {
  return {
    type: UPDATE_USER_APPLICATION_SUCCESS,
    userApplicationUpdated: response ? response.status : ''
  };
}

export function updateUserApplicationError() {
  return {
    type: UPDATE_USER_APPLICATION_ERROR
  };
}

export function updateUserApplicationClear() {
  return {
    type: UPDATE_USER_APPLICATION_CLEAR
  };
}
