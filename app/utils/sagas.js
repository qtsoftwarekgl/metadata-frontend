import { all } from 'redux-saga/effects';
import authSagas from 'enl-redux/modules/authSagas';
import adminAuthSagas from '../containers/Login/authSaga';
// import roleSagas from '../containers/App/CommonRedux/roleSaga';
// import healthFacilitySaga from '../containers/App/CommonRedux/healthFacilitySaga';
// import embassySaga from '../containers/App/CommonRedux/embassySaga';
// import citizenSaga from '../containers/App/CommonRedux/citizenSaga';
// import provinceSaga from '../containers/App/CommonRedux/provinceSaga';
// import districtSaga from '../containers/App/CommonRedux/districtSaga';
// import sectorSaga from '../containers/App/CommonRedux/sectorSaga';
// import cellSaga from '../containers/App/CommonRedux/cellSaga';
// import userSaga from '../containers/UserSettings/CreateUser/userSaga';
import userListSaga from '../containers/UserSettings/UserList/userListSaga';
// import updateUserSaga from '../containers/UserSettings/UserList/updateUserSaga';
// import deleteUsersSaga from '../containers/UserSettings/UserList/deleteUserSaga';
// import transferRequestSaga from '../containers/UserSettings/UserList/transferRequestSaga';
// import transferRequestListSaga from '../containers/UserSettings/TransferRequests/transferRequestListSaga';
// import transferLogsRootSaga from '../containers/UserSettings/TransferLogs/transferLogsSaga';
// import userApplicationsListSaga from '../containers/UserSettings/UserRegisterRequest/userApplicationsListSaga';
// import updateUserApplicationSaga from '../containers/UserSettings/UserRegisterRequest/updateUserApplicationSaga';
import userStatusLogsSaga from '../containers/UserSettings/UserStatusLogs/userStatusLogsSaga';
// import resetPasswordSaga from '../containers/App/CommonRedux/resetPasswordSaga';

export default function* sagas() {
  yield all([
    ...authSagas,
    ...adminAuthSagas,
    // ...roleSagas,
    // ...healthFacilitySaga,
    // ...embassySaga,
    // ...citizenSaga,
    // ...provinceSaga,
    // ...districtSaga,
    // ...sectorSaga,
    // ...cellSaga,
    // ...userSaga,
    ...userListSaga,
    // ...updateUserSaga,
    // ...deleteUsersSaga,
    // ...transferRequestSaga,
    // ...transferRequestListSaga,
    // ...transferLogsRootSaga,
    // ...userApplicationsListSaga,
    // ...updateUserApplicationSaga,            
    ...userStatusLogsSaga,    
    // ...resetPasswordSaga,
  ]);
}
