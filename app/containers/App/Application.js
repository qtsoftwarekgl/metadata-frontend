import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dashboard from '../Templates/Dashboard';
import {
  BlankPage,
  Error,
  NotFound,
  Form,
  Table,
  Parent,
  CreateUser,
  UserRegisterRequest,
  UserList,
  TransferRequests,
  ComingSoon,
  TransferLogs,
  UserStatusLogs,
  ResetPasswordNewLogin,
} from '../pageListAsync';
import { userProfile } from '../Login/authActions';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfileData: null
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { profileData, handleUserProfile } = nextProps;
    const updatedState = {};
    if (!profileData) {
      handleUserProfile();
    } else {
      updatedState.userProfileData = profileData;
    }
    return updatedState;
  }

  render() {
    const { changeMode, history } = this.props;
    const { userProfileData } = this.state;
    return (
      <Dashboard history={history} changeMode={changeMode} userProfileData={userProfileData}>
        <Switch>
          { /* Home */ }
          <Route exact path="/" component={BlankPage} />
          <Route path="/form" component={Form} />
          <Route path="/table" component={Table} />
          <Route path="/page-list" component={Parent} />
          <Route path="/user-settings/create-user" component={CreateUser} />
          <Route path="/user-settings/user-register-request" component={UserRegisterRequest} />
          <Route path="/metadata/dump-list" component={UserStatusLogs} />
          <Route path="/metadata/acknowlegement-list" component={UserList} />
          <Route path="/user-settings/transfer-logs" component={TransferLogs} />
          <Route path="/user-settings/transfer-requests" component={TransferRequests} />
          {/* reset password */}
          <Route path="/reset-user-password" component={ResetPasswordNewLogin} />
          <Route path="/pages/not-found" component={NotFound} />
          <Route path="/pages/error" component={Error} />
          <Route component={ComingSoon} />
        </Switch>
      </Dashboard>
    );
  }
}

Application.propTypes = {
  changeMode: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const adminAuthReducer = 'adminAuthReducer';
const mapStateToProps = state => ({
  profileData: state.get(adminAuthReducer) && state.get(adminAuthReducer).profileData ? state.get(adminAuthReducer).profileData : null
});

const mapDispatchToProps = dispatch => ({
  handleUserProfile: bindActionCreators(userProfile, dispatch),
});

const ApplicationMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);

export default ApplicationMapped;
