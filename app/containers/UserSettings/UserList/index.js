import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightBlue } from '@material-ui/core/colors';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import SuccessAlert from 'enl-components/Alerts/SuccessAlert';
import ConfirmationAlert from 'enl-components/Alerts/ConfirmationAlert';
import InfoAlert from 'enl-components/Alerts/InfoAlert';
import ErrorAlert from 'enl-components/Alerts/ErrorAlert';
import LoadingAlert from 'enl-components/Alerts/LoadingAlert';
import Typography from '@material-ui/core/Typography';
import Type from 'enl-styles/Typography.scss';
import Divider from '@material-ui/core/Divider';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EnhancedTable from '../../Pages/Table/EnhancedTable';
import styles from './user-list-jss';
import UserActionModal from './UserActionModal';
import UserViewModal from './UserViewModal';
import { fetchUserList } from './userListActions';
import { updateUser, updateUserClear } from './updateUserActions';
import { deleteUser, deleteUserClear } from './deleteUserActions';
import { transferRequest, transferRequestClear } from './transferRequestActions';
import {
  ROLES, PAGE, LIMIT, MINISTRIES
} from '../../../lib/constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  getErrorMessage
} from '../../../utils/helpers';

const headCells = [
  {
    id: 'createdAt', numeric: false, show: true, label: 'Date', isDate: true
  },
  {
    id: 'file_name', numeric: false, show: true, label: 'File Name'
  },
  {
    id: 'focaid', numeric: false, show: true, label: 'focaid'
  },
  {
    id: 'facilityName', numeric: false, show: true, label: 'Facility Name'
  },
  {
    id: 'version', numeric: false, show: true, label: 'Version'
  },
  // {
  //   id: 'facilityType', numeric: false, show: true, label: 'Facility Type', isCommunity: true
  // },
  // {
  //   id: 'facilityName', numeric: false, show: true, label: 'Facility Name'
  // },
  // {
  //   id: 'displayFacilityArea', numeric: false, show: true, label: 'Facility Area'
  // },
  // {
  //   id: 'role', numeric: false, show: true, label: 'Role'
  // },
  // {
  //   id: 'ministry', numeric: false, show: true, label: 'Ministry'
  // },
  // {
  //   id: 'status', numeric: false, show: true, label: 'Status', statusType: 'switch'
  // },
  // {
  //   id: 'actions', numeric: false, show: true, isAction: true, label: 'Actions', actionType: 'approve_reload'
  // }
];

const theme = createMuiTheme({
  palette: {
    primary: lightBlue
  },
  spacing: 1
});

const PASSWORD_UPDATE = 'PASSWORD_UPDATE';
const PEOFILE_UPDATE = 'PEOFILE_UPDATE';
const STATUS_UPDATE = 'STATUS_UPDATE';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      alertMessage: '',
      showConfirmAlert: false,
      confirmAlertMessage: '',
      showInfoAlert: false,
      infoMessage: '',
      showErrorAlert: false,
      errorAlertMessage: '',
      page: PAGE,
      limit: LIMIT,
      showUserViewModal: false,
      showActionModal: false,
      actionData: null,
      showTransferConfirmation: false,
      transferConfirmMessage: '',
      surname: '',
      email: '',
      role: '',
      ministry: '',
      facilityName: '',
      status: '',
      statusConfirmAlert: false,
      selectedItemId: '',
      selectedStatusValue: false,
      selectedUserName: '',
      updateType: '',
      transferData: null,
      toolTipOpen: false,
      showMultiDeleteConfirmation: false,
      selectedIds: [],
      fileName:'',
      focaid:'',
      version:'',
      facilityName:''
    };
    this.handleAction = this.handleAction.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleConfirmReject = this.handleConfirmReject.bind(this);
    this.handleInfoClose = this.handleInfoClose.bind(this);
    this.handleActionModalClose = this.handleActionModalClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { handleFetchUserList } = this.props;
    const { page, limit } = this.state;
    handleFetchUserList({ page, limit });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const updatedState = {};
    const {
      userUpdated,
      updateMessage,
      transferRequestCreated,
      handleUpdateUserClear,
      handleFetchUserList,
      handleTransferRequestClear,
      userDeleted,
      handleDeleteUserClear,
      errorMessage,
      transferErrorMessage,
      userDeletedErrorMessage
    } = nextProps;
    const {
      selectedUserName, selectedStatusValue, updateType, page, limit
    } = prevState;
    let callUserList = false;
    if (updateType === PEOFILE_UPDATE) {
      if (userUpdated === 'ok') {
        updatedState.showAlert = true;
        updatedState.alertMessage = `${selectedUserName}'s Profile updated successfully.`;
        updatedState.updateType = '';
        handleUpdateUserClear();
      } else if (userUpdated === 'error') {
        updatedState.showErrorAlert = true;
        updatedState.errorAlertMessage = getErrorMessage(updateMessage);
        updatedState.updateType = '';
        handleUpdateUserClear();
      }
    }
    if (updateType === PASSWORD_UPDATE) {
      if (userUpdated === 'ok') {
        updatedState.showAlert = true;
        updatedState.alertMessage = `${selectedUserName}'s password updated successfully.`;
        updatedState.updateType = '';
        handleUpdateUserClear();
      } else if (userUpdated === 'error') {
        updatedState.showErrorAlert = true;
        updatedState.errorAlertMessage = getErrorMessage(errorMessage);
        updatedState.updateType = '';
        handleUpdateUserClear();
      }
    } else if (updateType === STATUS_UPDATE) {
      if (userUpdated === 'ok') {
        updatedState.showAlert = true;
        updatedState.alertMessage = `${selectedUserName} status updated to ${selectedStatusValue ? 'Active' : 'Inactive'}`;
        updatedState.updateType = '';
        handleUpdateUserClear();
        callUserList = true;
      } else if (userUpdated === 'error') {
        updatedState.showErrorAlert = true;
        updatedState.errorAlertMessage = getErrorMessage(errorMessage);
        updatedState.updateType = '';
        handleUpdateUserClear();
      }
    }

    if (transferRequestCreated === 'ok') {
      updatedState.showAlert = true;
      updatedState.alertMessage = `Transfer request created for ${selectedUserName}`;
      handleFetchUserList({ page, limit });
      handleTransferRequestClear();
    } else if (transferRequestCreated === 'error') {
      updatedState.showErrorAlert = true;
      updatedState.errorAlertMessage = getErrorMessage(transferErrorMessage);
      handleTransferRequestClear();
    }

    if (userDeleted === 'ok') {
      updatedState.showAlert = true;
      updatedState.alertMessage = 'Selected record(s) deleted successfully';
      updatedState.selectedIds = [];
      handleDeleteUserClear();
      callUserList = true;
    } else if (userDeleted === 'error') {
      updatedState.showErrorAlert = true;
      updatedState.errorAlertMessage = getErrorMessage(userDeletedErrorMessage);
      updatedState.selectedIds = [];
      handleDeleteUserClear();
    }

    if (callUserList) {
      const {
        // surname,
        // email,
        // role,
        // ministry,
        // facilityName,
        // status,
        fileName,
        focaid,
        version,
        facilityName
      } = prevState;
      const params = {
        page,
        limit,
        fileName,
        focaid,
        version,
        facilityName
        // name: surname,
        // email,
        // role,
        // facilityName,
        // ministry: (ministry && ministry !== 'All') ? ministry : '',
        // status: (status && status !== 'All') ? status : ''
      };
      handleFetchUserList(params);
    }
    return updatedState;
  }

  handleAction = (action, rowData) => {
    if (action === 'view') {
      this.setState({
        showUserViewModal: true,
        actionData: rowData
      });
    } else if (action === 'approve') {
      this.setState({
        showAlert: true,
        alertMessage: rowData.surname + ' has approved successfully!'
      });
    } else if (action === 'reject') {
      this.setState({
        showConfirmAlert: true,
        confirmAlertMessage: 'Do you want to reject ' + rowData.surname + '.'
      });
    } else if (action === 'reload') {
      this.setState({
        showActionModal: true,
        actionData: rowData
      });
    } else if (action === 'transfer') {
      this.setState({
        showTransferConfirmation: true,
        transferConfirmMessage: `Are you sure want to transfer ${rowData.name} ?`,
        selectedItemId: rowData._id,
        selectedUserName: rowData.name,
        transferData: rowData
      });
    } else if (action === 'passwordReset') {
      const { handleUpdateUser } = this.props;
      handleUpdateUser(rowData._id, {
        surName: rowData.surName, postNames: rowData.postNames, email: rowData.email, password: rowData.password
      });
      this.setState({
        updateType: PASSWORD_UPDATE,
        selectedUserName: `${rowData.surName} ${rowData.postNames}`
      });
    } else if (action === 'profile') {
      const { handleUpdateUser } = this.props;
      handleUpdateUser(rowData._id, {
        surName: rowData.surName, postNames: rowData.postNames, email: rowData.email, phoneNumber: rowData.phoneNumber
      });
      this.setState({
        updateType: PEOFILE_UPDATE,
        selectedUserName: `${rowData.surName} ${rowData.postNames}`
      });
    }
  }

  exportCsv = async (headers) => {
    let params = {};
    const {
      surname,
      email,
      role,
      facilityName,
      ministry,
      status
    } = this.state;
    if (surname || email || role || ministry || facilityName || status) {
      params = {
        name: surname,
        email,
        facilityName,
        role: (role && role !== 'All') ? role : '',
        ministry: (ministry && ministry !== 'All') ? ministry : '',
        status: (status && status !== 'All') ? status : ''
      };
    }
    params.skipPagination = true;
    const res = await API.get(URL.USERS, { data: {}, params })
      .then(async (response) => response.data)
      .catch((error) => {
        console.log(error);
      });
    const heading = [];
    const keys = [];
    headers.forEach((row) => {
      if (row.show && row.id !== 'actions') {
        heading.push(row.label);
        keys.push(row.id);
      }
    });
    let csv = heading.join(',');
    csv += '\n';
    res.forEach((row) => {
      const formatData = [];
      keys.forEach(key => {
        if (row[key]) {
          formatData.push(row[key]);
        } else {
          formatData.push('N/A');
        }
      });
      csv += formatData.join(',');
      csv += '\n';
    });
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = `users-${+new Date()}.csv`;
    hiddenElement.click();
  }

  handleConfirmTransfer = () => {
    const { transferData } = this.state;
    const { handleTransferRequest } = this.props;
    handleTransferRequest(transferData);
    this.setState({
      showTransferConfirmation: false,
    });
  }

  handleAlertClose = () => {
    this.setState({
      showAlert: false,
      alertMessage: '',
      showActionModal: false
    });
  }

  handleConfirmReject = () => {
    this.setState({
      showInfoAlert: true,
      infoMessage: 'User has been Rejected!',
      showConfirmAlert: false,
      confirmAlertMessage: ''
    });
  }

  handleInfoClose = () => {
    this.setState({
      showInfoAlert: false,
      infoMessage: '',
      showActionModal: false
    });
  }

  handleActionModalClose = () => {
    this.setState({
      showActionModal: false
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleStatusChange = (rowData, value) => {
    this.setState({
      selectedItemId: rowData._id,
      selectedStatusValue: value,
      statusConfirmAlert: true,
      selectedUserName: `${rowData.surName} ${rowData.postNames}`
    });
  }

  handleOnStatusConfirm = () => {
    const { handleUpdateUser } = this.props;
    const { selectedItemId, selectedStatusValue } = this.state;
    const status = selectedStatusValue ? 'ACTIVE' : 'INACTIVE';
    handleUpdateUser(selectedItemId, { status });
    this.setState({
      statusConfirmAlert: false,
      updateType: STATUS_UPDATE
    });
  }

  handlePageChange = (newPage) => {
    const { handleFetchUserList } = this.props;
    const {
      limit,
      // surname,
      // email,
      // role,
      // facilityName,
      // ministry,
      // status,
      fileName,
      focaid,
      version,
      facilityName
    } = this.state;
    const params = {
      page: newPage,
      limit,
      fileName,
      focaid,
      version,
      facilityName
      // name: surname,
      // email,
      // facilityName,
      // role: (role && role !== 'All') ? role : '',
      // ministry: (ministry && ministry !== 'All') ? ministry : '',
      // status: (status && status !== 'All') ? status : ''
    };
    handleFetchUserList(params);
    this.setState({
      page: newPage
    });
  }

  handleSearch = () => {
    const { handleFetchUserList } = this.props;
    const {
      // surname,
      // email,
      // role,
      // facilityName,
      // ministry,
      // status
      fileName,
      focaid,
      version,
      facilityName
    } = this.state;
    // if (surname || email || role || ministry || facilityName || status) {
      if ( fileName || focaid || version || facilityName ) {
      this.setState({
        page: PAGE,
        limit: LIMIT
      });
      const params = {
        page: PAGE,
        limit: LIMIT,
        fileName,
        focaid,
        version,
        facilityName,
        // name: surname,
        // email,
        // facilityName,
        // role: (role && role !== 'All') ? role : '',
        // ministry: (ministry && ministry !== 'All') ? ministry : '',
        // status: (status && status !== 'All') ? status : ''
      };
      handleFetchUserList(params);
    } else {
      this.setState({ toolTipOpen: true });
    }
  }

  handleTooltipClose = () => {
    this.setState({ toolTipOpen: false });
  };

  handleClearFilters = () => {
    this.setState({
      fileName: '',
      focaid: '',
      version:'',
      facilityName:''
      // surname: '',
      // email: '',
      // role: '',
      // facilityName: '',
      // ministry: '',
      // status: ''
    });
    const { handleFetchUserList } = this.props;
    const { page, limit } = this.state;
    handleFetchUserList({ page, limit });
  }

  handleMultiDelete = (ids) => {
    this.setState({
      showMultiDeleteConfirmation: true,
      selectedIds: ids
    });
  }

  handleMuliDelConfirmClose = () => {
    this.setState({
      showMultiDeleteConfirmation: false,
      selectedIds: []
    });
  }

  handleMultiDelConfirmed = () => {
    const { handleDeleteUser } = this.props;
    const { selectedIds } = this.state;
    handleDeleteUser(selectedIds);
    this.setState({
      showMultiDeleteConfirmation: false,
    });
  }

  render() {
    const {
      classes, userList, count, loading, transferRequestLoading, updateLoading, deleteLoading, userDeleted
    } = this.props;
    const title = brand.name;
    const description = brand.desc;
    const {
      showAlert,
      alertMessage,
      showConfirmAlert,
      confirmAlertMessage,
      infoMessage,
      showInfoAlert,
      showErrorAlert,
      errorAlertMessage,
      page,
      showUserViewModal,
      showActionModal,
      actionData,
      showTransferConfirmation,
      transferConfirmMessage,
      surname,
      email,
      facilityName,
      role,
      ministry,
      status,
      statusConfirmAlert,
      selectedStatusValue,
      selectedUserName,
      toolTipOpen,
      showMultiDeleteConfirmation,
      selectedIds,
      fileName,
      focaid,
      version,
    } = this.state;
    console.log("count",count)
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock whiteBg hideBlockSection>
          <Typography variant="h5" className={Type.textLeft} gutterBottom>
            <span>Acknowledgement List</span>
            {/* <Button
              href="/user-settings/create-user"
              className={classes.buttonAddNew}
              variant="contained"
              color="secondary"
              size="small"
            >
              Add New
              {' '}
              <AddIcon />
            </Button> */}
          </Typography>
          <Divider style={{ width: '100%' }} />
          <Grid container spacing={1}>
            <Grid container item xs={12} sm={9}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput} style={{ paddingRight: 8, paddingLeft: 8 }}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="File Name"
                        value={fileName}
                        onChange={this.handleChange('fileName')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput} style={{ paddingRight: 8, paddingLeft: 8 }}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="Focai Id"
                        value={focaid}
                        onChange={this.handleChange('focaid')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput} style={{ paddingRight: 8, paddingLeft: 8 }}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="Facility Name"
                        value={facilityName}
                        onChange={this.handleChange('facilityName')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>              
              </Grid>
            <Grid container spacing={1}> 
              <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput} style={{ paddingRight: 8, paddingLeft: 8 }}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="Version"
                        value={version}
                        onChange={this.handleChange('version')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>              
              </Grid>
              {/* <Grid container spacing={1}> */}
                {/* <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="role-simple">Role</InputLabel>
                    <ThemeProvider theme={theme}>
                      <Select
                        value={role}
                        onChange={this.handleChange('role')}
                        inputProps={{
                          name: 'role',
                          id: 'role-simple',
                        }}
                      >
                        <MenuItem value="All">All</MenuItem>
                        {
                          ROLES.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)
                        }
                      </Select>
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="ministry-simple">Ministry</InputLabel>
                    <ThemeProvider theme={theme}>
                      <Select
                        value={ministry}
                        onChange={this.handleChange('ministry')}
                        inputProps={{
                          name: 'ministry',
                          id: 'ministry-simple',
                        }}
                      >
                        <MenuItem value="All">All</MenuItem>
                        {
                          MINISTRIES.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)
                        }
                      </Select>
                    </ThemeProvider>
                  </FormControl>
                </Grid> */}
                {/* <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="status-simple">Status</InputLabel>
                    <ThemeProvider theme={theme}>
                      <Select
                        value={status}
                        onChange={this.handleChange('status')}
                        inputProps={{
                          name: 'status',
                          id: 'status-simple',
                        }}
                      >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                        <MenuItem value="DELETED">Deleted</MenuItem>
                      </Select>
                    </ThemeProvider>
                  </FormControl>
                </Grid> */}
              {/* </Grid> */}
            </Grid>
            <Grid container item xs={12} sm={3} alignContent="center">
              <Grid item xs={12} sm={12} align="center" className={classes.marginY1}>
                <ClickAwayListener onClickAway={this.handleTooltipClose}>
                  <Tooltip
                    PopperProps={{
                      disablePortal: true,
                    }}
                    placement="top"
                    onClose={this.handleTooltipClose}
                    open={toolTipOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title="Please enter a value for one filter and try"
                  >
                    <Button
                      onClick={() => this.handleSearch()}
                      style={{ width: 100 }}
                      variant="contained"
                      color="primary"
                      className={classes.buttonSearch}
                      size="small"
                    >
                      Search
                    </Button>
                  </Tooltip>
                </ClickAwayListener>
              </Grid>
              <Grid item xs={12} sm={12} align="center" className={classes.marginY1}>
                <Button
                  style={{ padding: 5, marginTop: 10, width: 100 }}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => this.handleClearFilters()}
                  className={classes.buttonLink}
                >
                  <span>Clear Filters</span>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </PapperBlock>
        <div>
          <EnhancedTable
            // multiselect
            loading={loading}
            tableTitle="Acknowledgement"
            page={page}
            headCells={headCells}
            rows={userList}
            totalData={count || 0}
            onPageChange={(newPage) => this.handlePageChange(newPage)}
            // onActionClicked={(action, rowData) => this.handleAction(action, rowData)}
            // handleStatusChange={(rowData, value) => this.handleStatusChange(rowData, value)}
            // onDeleteRows={(ids) => this.handleMultiDelete(ids)}
            // deleted={userDeleted}
            download={(headers) => this.exportCsv(headers)}
          />
        </div>
        <UserViewModal
          open={showUserViewModal}
          onClose={() => {
            this.setState({
              showUserViewModal: false
            });
          }}
          userData={actionData}
        />
        <UserActionModal
          open={showActionModal}
          onClose={this.handleActionModalClose}
          userData={actionData}
          onAction={(value, adata) => this.handleAction(value, adata)}
        />
        <SuccessAlert
          message={alertMessage}
          open={showAlert}
          onClose={this.handleAlertClose}
        />
        <ConfirmationAlert
          message={`Are you sure want to delete the selected record${selectedIds.length > 1 ? 's' : ''}`}
          open={showMultiDeleteConfirmation}
          onClose={this.handleMuliDelConfirmClose}
          onConfirm={this.handleMultiDelConfirmed}
          onCancel={this.handleMuliDelConfirmClose}
        />
        <ConfirmationAlert
          message={confirmAlertMessage}
          open={showConfirmAlert}
          onClose={this.handleAlertClose}
          onConfirm={this.handleConfirmReject}
          onCancel={this.handleAlertClose}
        />
        <InfoAlert
          message={infoMessage}
          open={showInfoAlert}
          onClose={this.handleInfoClose}
        />
        <ConfirmationAlert
          message={transferConfirmMessage}
          open={showTransferConfirmation}
          onClose={() => {
            this.setState({
              showTransferConfirmation: false
            });
          }}
          onConfirm={() => this.handleConfirmTransfer()}
          onCancel={() => {
            this.setState({
              showTransferConfirmation: false
            });
          }}
        />
        <ConfirmationAlert
          message={`Are you sure want to update ${selectedUserName} status to ${selectedStatusValue ? 'Active' : 'Inactive'} ?`}
          open={statusConfirmAlert}
          onClose={() => {
            this.setState({
              selectedItemId: '',
              selectedStatusValue: '',
              statusConfirmAlert: false
            });
          }}
          onConfirm={() => this.handleOnStatusConfirm()}
          onCancel={() => {
            this.setState({
              selectedItemId: '',
              selectedStatusValue: '',
              statusConfirmAlert: false,
            });
          }}
        />
        <ErrorAlert
          message={errorAlertMessage}
          open={showErrorAlert}
          onClose={() => {
            this.setState({
              showErrorAlert: false,
              errorAlertMessage: ''
            });
          }}
        />
        <LoadingAlert
          open={transferRequestLoading || updateLoading || deleteLoading}
        />
      </div>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFetchUserList: PropTypes.func.isRequired,
  userList: PropTypes.array,
  count: PropTypes.number,
  // handleUpdateUser: PropTypes.func.isRequired,
  // handleTransferRequest: PropTypes.func.isRequired,
  // handleTransferRequestClear: PropTypes.func.isRequired, // eslint-disable-line
  // transferRequestCreated: PropTypes.string, // eslint-disable-line
  // userUpdated: PropTypes.string, // eslint-disable-line
  // handleUpdateUserClear: PropTypes.func.isRequired, // eslint-disable-line
  loading: PropTypes.bool,
  // transferRequestLoading: PropTypes.bool,
  // updateLoading: PropTypes.bool,
  // deleteLoading: PropTypes.bool,
  // handleDeleteUser: PropTypes.func.isRequired,
  // userDeleted: PropTypes.string
};

UserList.defaultProps = {
  userList: [],
  count: 0,
  // userUpdated: '',
  // updateMessage: '',
  // transferRequestCreated: '',
  // loading: false,
  // transferRequestLoading: false,
  // updateLoading: false,
  // deleteLoading: false,
  // userDeleted: ''
};

const userListReducer = 'userListReducer';
// const updateUserReducer = 'updateUserReducer';
// const transferRequestReducer = 'transferRequestReducer';
// const deleteUserReducer = 'deleteUserReducer';
const mapStateToProps = state => ({
  loading: state.get(userListReducer) && state.get(userListReducer).loading ? state.get(userListReducer).loading : false,
  userList: state.get(userListReducer) && state.get(userListReducer).userList ? state.get(userListReducer).userList : [],
  count: state.get(userListReducer) && state.get(userListReducer).count ? state.get(userListReducer).count : 0,
  // userUpdated: state.get(updateUserReducer) && state.get(updateUserReducer).userUpdated ? state.get(updateUserReducer).userUpdated : '',
  // updateMessage: state.get(updateUserReducer) && state.get(updateUserReducer).updateMessage ? state.get(updateUserReducer).updateMessage : '',
  // errorMessage: state.get(updateUserReducer) && state.get(updateUserReducer).errorMessage ? state.get(updateUserReducer).errorMessage : '',
  // updateLoading: state.get(updateUserReducer) && state.get(updateUserReducer).loading,
  // transferRequestCreated: state.get(transferRequestReducer) && state.get(transferRequestReducer).transferRequestCreated,
  // transferErrorMessage: state.get(transferRequestReducer) && state.get(transferRequestReducer).errorMessage,
  // transferRequestLoading: state.get(transferRequestReducer) && state.get(transferRequestReducer).loading,
  // deleteLoading: state.get(deleteUserReducer) && state.get(deleteUserReducer).loading,
  // userDeleted: state.get(deleteUserReducer) && state.get(deleteUserReducer).userDeleted ? state.get(deleteUserReducer).userDeleted : '',
  // userDeletedErrorMessage: state.get(deleteUserReducer) && state.get(deleteUserReducer).errorMessage ? state.get(deleteUserReducer).errorMessage : ''
});

const mapDispatchToProps = dispatch => ({
  handleFetchUserList: bindActionCreators(fetchUserList, dispatch),
  // handleUpdateUser: bindActionCreators(updateUser, dispatch),
  // handleUpdateUserClear: bindActionCreators(updateUserClear, dispatch),
  // handleTransferRequest: bindActionCreators(transferRequest, dispatch),
  // handleTransferRequestClear: bindActionCreators(transferRequestClear, dispatch),
  // handleDeleteUser: bindActionCreators(deleteUser, dispatch),
  // handleDeleteUserClear: bindActionCreators(deleteUserClear, dispatch),
});

const UserListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);

export default withStyles(styles)(UserListMapped);
