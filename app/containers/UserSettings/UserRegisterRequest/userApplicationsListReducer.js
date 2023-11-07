import { fromJS } from 'immutable';
import {
  FETCH_USER_APPLICATIONS_LIST_REQUEST,
  FETCH_USER_APPLICATIONS_LIST_SUCCESS,
  FETCH_USER_APPLICATIONS_LIST_ERROR
} from './constants';

export const initialState = fromJS({});

function userApplicationsListReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_APPLICATIONS_LIST_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case FETCH_USER_APPLICATIONS_LIST_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        userApplications: action.userApplications,
        count: action.count
      });
    case FETCH_USER_APPLICATIONS_LIST_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    default:
      return state;
  }
}

export default userApplicationsListReducer;
