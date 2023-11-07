import {
  TRANSTER_REQUEST,
  TRANSTER_REQUEST_REQUEST,
  TRANSTER_REQUEST_SUCCESS,
  TRANSTER_REQUEST_ERROR,
  TRANSTER_REQUEST_CLEAR,
  TRANSTER_REQUEST_PENDING,
  TRANSTER_REQUEST_PENDING_REQUEST,
  TRANSTER_REQUEST_PENDING_SUCCESS,
  TRANSTER_REQUEST_PENDING_ERROR,
  TRANSTER_REQUEST_PENDING_CLEAR
} from './constants';

export function transferRequest(transferData) {
  return {
    type: TRANSTER_REQUEST,
    payload: {
      currentAccessType: transferData.currentAccessType || '',
      appliedAccessType: transferData.appliedAccessType || '',
      role: transferData.role || '',
      ministry: transferData.ministry || '',
      currentFacility: transferData.currentFacility || '',
      appliedFacility: transferData.appliedFacility || '',
      transferReason: transferData.transferReason || '',
      userId: transferData.userId || '',
    }
  };
}

export function transferRequestRequest() {
  return {
    type: TRANSTER_REQUEST_REQUEST
  };
}

export function transferRequestSuccess(response) {
  let errorMessage = '';
  if (response.status === 'error') {
    errorMessage = response.message;
  }
  return {
    type: TRANSTER_REQUEST_SUCCESS,
    transferRequestCreated: response ? response.status : '',
    errorMessage
  };
}

export function transferRequestError(response) {
  let errorMessage = '';
  if (response.status === 'error') {
    errorMessage = response.message;
  }
  return {
    type: TRANSTER_REQUEST_ERROR,
    errorMessage
  };
}

export function transferRequestClear() {
  return {
    type: TRANSTER_REQUEST_CLEAR
  };
}

export function transferRequestPending(id) {
  return {
    type: TRANSTER_REQUEST_PENDING,
    payload: { id }
  };
}

export function transferRequestPendingRequest() {
  return {
    type: TRANSTER_REQUEST_PENDING_REQUEST
  };
}

export function transferRequestPendingSuccess(response) {
  let errorMessage = '';
  if (response.status === 'error') {
    errorMessage = response.message;
  }
  return {
    type: TRANSTER_REQUEST_PENDING_SUCCESS,
    status: response ? response.status : '',
    transferReqPending: response ? response.data : [],
    count: response ? response.count : 0,
    errorMessage
  };
}

export function transferRequestPendingError(response) {
  let errorMessage = '';
  if (response.status === 'error') {
    errorMessage = response.message;
  }
  return {
    type: TRANSTER_REQUEST_PENDING_ERROR,
    status: response ? response.status : '',
    errorMessage
  };
}

export function transferRequestPendingClear() {
  return {
    type: TRANSTER_REQUEST_PENDING_CLEAR
  };
}
