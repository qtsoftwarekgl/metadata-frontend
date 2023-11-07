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
import MomentUtils from '@date-io/moment';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import SuccessAlert from 'enl-components/Alerts/SuccessAlert';
import ConfirmationAlert from 'enl-components/Alerts/ConfirmationAlert';
import InfoAlert from 'enl-components/Alerts/InfoAlert';
import Typography from '@material-ui/core/Typography';
import Type from 'enl-styles/Typography.scss';
import Divider from '@material-ui/core/Divider';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorAlert from 'enl-components/Alerts/ErrorAlert';
import moment from 'moment';
import LoadingAlert from 'enl-components/Alerts/LoadingAlert';
import UserViewModal from '../UserList/UserViewModal';
import styles from './user-register-request-jss';
import EnhancedTable from '../../Pages/Table/EnhancedTable';
import { fetchUserApplications } from './userApplicationsListActions';
import { updateUserApplication, updateUserApplicationClear } from './updateUserApplicationActions';
import { DATE_FORMAT, REGEX, PHONE_LENGTH } from '../../../lib/constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';

const headCells = [
  {
    id: 'createdAt', numeric: false, show: true, label: 'Applied Date-Time', isDate: true
  },
  {
    id: 'surName', numeric: false, show: true, label: 'Surname'
  },
  {
    id: 'postNames', numeric: false, show: true, label: 'Post-Names'
  },
  {
    id: 'phoneNumber', numeric: false, show: true, label: 'Telephone'
  },
  {
    id: 'email', numeric: false, show: true, label: 'Email'
  },
  {
    id: 'facilityType', numeric: false, show: true, label: 'Facility Type', isCommunity: true
  },
  {
    id: 'facilityName', numeric: false, show: true, label: 'Facility Name'
  },
  {
    id: 'displayFacilityArea', numeric: false, show: true, label: 'Facility Area'
  },
  {
    id: 'role', numeric: false, show: true, label: 'Role'
  },
  {
    id: 'ministry', numeric: false, show: true, label: 'Ministry'
  },
  {
    id: 'status', numeric: false, show: true, label: 'Status'
  },
  {
    id: 'actions', numeric: false, show: true, isAction: true, label: 'Actions', actionType: 'view_approve_reject'
  },
];

const theme = createMuiTheme({
  palette: {
    primary: lightBlue
  },
  spacing: 1
});

class UserRegisterRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: null,
      toDate: null,
      surname: '',
      phoneNumber: '',
      email: '',
      facilityName: '',
      showAlert: false,
      alertMessage: '',
      showErrorAlert: false,
      errorAlertMessage: '',
      showConfirmAlert: false,
      confirmAlertMessage: '',
      showInfoAlert: false,
      infoMessage: '',
      page: 1,
      limit: 20,
      facilityType: '',
      selectedId: '',
      selectedUserName: '',
      actionType: '',
      showUserViewModal: false,
      actionData: null,
      toolTipOpen: false,
      status: 'PENDING'
    };
    this.handleAction = this.handleAction.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleInfoClose = this.handleInfoClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { handleFetchUserApplications } = this.props;
    const { page, limit, status } = this.state;
    handleFetchUserApplications({ page, limit, status });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      userApplicationUpdated,
      handleUpdateUserApplicationClear,
      handleFetchUserApplications
    } = nextProps;
    const { selectedUserName, actionType } = prevState;
    const updatedState = {};
    let loadList = false;
    if (userApplicationUpdated === 'ok') {
      updatedState.showAlert = true;
      loadList = true;
      if (actionType === 'approve') {
        updatedState.alertMessage = `${selectedUserName} application approved successfully.`;
      } else if (actionType === 'reject') {
        updatedState.alertMessage = `${selectedUserName} application rejected.`;
      }
      handleUpdateUserApplicationClear();
    } else if (userApplicationUpdated === 'error') {
      updatedState.showErrorAlert = true;
      if (actionType === 'approve') {
        updatedState.errorAlertMessage = `Failed to approve ${selectedUserName}. Try again later.`;
      } else if (actionType === 'reject') {
        updatedState.errorAlertMessage = `Failed to reject ${selectedUserName}. Try again later.`;
      }
      handleUpdateUserApplicationClear();
    }
    if (loadList) {
      const {
        page,
        limit,
        surname,
        phoneNumber,
        email,
        facilityName,
        fromDate,
        toDate,
        facilityType,
        status
      } = prevState;
      const params = {
        page: page || '',
        limit: limit || '',
        name: surname || '',
        phoneNumber: phoneNumber || '',
        email: email || '',
        facilityName: facilityName || '',
        fromDate: fromDate || '',
        toDate: toDate || '',
        facilityType: (facilityType && facilityType !== 'All') ? facilityType : '',
        status: (status && status !== 'All') ? status : ''
      };
      handleFetchUserApplications(params);
    }
    return updatedState;
  }

  handleSearch = () => {
    const { handleFetchUserApplications } = this.props;
    const {
      page,
      limit,
      surname,
      phoneNumber,
      email,
      facilityName,
      fromDate,
      toDate,
      facilityType,
      status
    } = this.state;
    if (surname || phoneNumber || email || fromDate || toDate || facilityType || status || facilityName) {
      const params = {
        page: page || '',
        limit: limit || '',
        name: surname || '',
        phoneNumber: phoneNumber || '',
        email: email || '',
        facilityName: facilityName || '',
        fromDate: fromDate || '',
        toDate: toDate || '',
        facilityType: (facilityType && facilityType !== 'All') ? facilityType : '',
        status: (status && status !== 'All') ? status : ''
      };
      handleFetchUserApplications(params);
    } else {
      this.setState({ toolTipOpen: true });
    }
  }

  exportCsv = async (headers) => {
    let params = {};
    const {
      surname,
      phoneNumber,
      email,
      facilityName,
      fromDate,
      toDate,
      facilityType,
      status
    } = this.state;
    if (surname || phoneNumber || email || fromDate || toDate || facilityType || status || facilityName) {
      params = {
        name: surname || '',
        phoneNumber: phoneNumber || '',
        email: email || '',
        facilityName: facilityName || '',
        fromDate: fromDate ? moment(fromDate).format(DATE_FORMAT) : '',
        toDate: toDate ? moment(toDate).format(DATE_FORMAT) : '',
        facilityType: (facilityType && facilityType !== 'All') ? facilityType : '',
        status: (status && status !== 'All') ? status : ''
      };
    }
    params.skipPagination = true;
    const res = await API.get(URL.USER_APPLICATIONS, { data: {}, params })
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
    hiddenElement.download = `user-register-request-${+new Date()}.csv`;
    hiddenElement.click();
  }

  handleTooltipClose = () => {
    this.setState({ toolTipOpen: false });
  };

  handlePageChange = (newPage) => {
    const { handleFetchUserApplications } = this.props;
    const {
      limit,
      surname,
      phoneNumber,
      email,
      facilityName,
      fromDate,
      toDate,
      facilityType,
      status
    } = this.state;
    const params = {
      page: newPage || 1,
      limit: limit || 20,
      name: surname || '',
      phoneNumber: phoneNumber || '',
      email: email || '',
      facilityName: facilityName || '',
      fromDate: fromDate || '',
      toDate: toDate || '',
      facilityType: (facilityType && facilityType !== 'All') ? facilityType : '',
      status: (status && status !== 'All') ? status : ''
    };
    handleFetchUserApplications(params);
    this.setState({
      page: newPage
    });
  }

  handleClearFilters = () => {
    this.setState({
      surname: '',
      phoneNumber: '',
      email: '',
      fromDate: null,
      toDate: null,
      facilityType: '',
      facilityName: '',
      status: 'PENDING'
    });
    const { handleFetchUserApplications } = this.props;
    const { page, limit } = this.state;
    handleFetchUserApplications({ page, limit, status: 'PENDING' });
  }

  handleChange = name => event => {
    if (name === 'phoneNumber') {
      const { phoneNumber } = this.state;
      if (REGEX.NUMBER.test(event.target.value)) {
        if (phoneNumber.length < PHONE_LENGTH) {
          this.setState({
            phoneNumber: event.target.value
          });
        } else {
          this.setState({
            phoneNumber: event.target.value.slice(0, PHONE_LENGTH)
          });
        }
      }
    } else {
      this.setState({
        [name]: event.target.value,
      });
    }
  };

  handleFromDateChange = (date) => {
    this.setState({
      fromDate: date
    });
  }

  handleToDateChange = (date) => {
    this.setState({
      toDate: date
    });
  }

  handleAction = (action, rowData) => {
    if (action === 'approve') {
      this.setState({
        showConfirmAlert: true,
        confirmAlertMessage: `Are you sure want to approve ${rowData.surName} ${rowData.postNames}?`,
        actionType: 'approve',
        selectedId: rowData._id,
        selectedUserName: `${rowData.surName} ${rowData.postNames}`
      });
    } else if (action === 'reject') {
      this.setState({
        showConfirmAlert: true,
        confirmAlertMessage: `Are you sure want to reject ${rowData.surName} ${rowData.postNames}?`,
        actionType: 'reject',
        selectedId: rowData._id,
        selectedUserName: `${rowData.surName} ${rowData.postNames}`
      });
    } else if (action === 'view') {
      this.setState({
        showUserViewModal: true,
        actionData: rowData
      });
    }
  }

  handleConfirm = () => {
    const { handleUpdateUserApplication } = this.props;
    const { selectedId, actionType } = this.state;
    let status = '';
    if (actionType === 'approve') {
      status = 'APPROVED';
    } else if (actionType === 'reject') {
      status = 'REJECTED';
    }
    this.setState({
      showConfirmAlert: false,
      confirmAlertMessage: ''
    });
    handleUpdateUserApplication(selectedId, { status });
  }

  handleAlertClose = () => {
    this.setState({
      showAlert: false,
      alertMessage: '',
      showConfirmAlert: false,
      confirmAlertMessage: ''
    });
  }

  handleInfoClose = () => {
    this.setState({
      showInfoAlert: false,
      infoMessage: ''
    });
  }

  render() {
    const {
      classes, userApplications, count, loading, updateLoading
    } = this.props;

    const title = brand.name;
    const description = brand.desc;
    const {
      toDate,
      fromDate,
      showAlert,
      alertMessage,
      showConfirmAlert,
      confirmAlertMessage,
      infoMessage,
      showInfoAlert,
      page,
      surname,
      phoneNumber,
      email,
      facilityName,
      facilityType,
      status,
      showErrorAlert,
      errorAlertMessage,
      showUserViewModal,
      actionData,
      toolTipOpen
    } = this.state;
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
            <span>User Register Request</span>
          </Typography>
          <Divider style={{ marginBottom: 20 }} />
          <Grid container spacing={1}>
            <Grid container item xs={12} sm={9}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                  <FormControl className={classes.formControlInput}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="Name"
                        value={surname}
                        onChange={this.handleChange('surname')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl className={classes.formControlInput}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="Telephone"
                        value={phoneNumber}
                        onChange={this.handleChange('phoneNumber')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl className={classes.formControlInput}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="Email"
                        value={email}
                        onChange={this.handleChange('email')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl className={classes.formControlInput}>
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
                <Grid item xs={12} sm={3}>
                  <FormControl className={classes.formControlInput}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <ThemeProvider theme={theme}>
                        <DatePicker
                          label="From Date"
                          format={DATE_FORMAT}
                          value={fromDate}
                          onChange={this.handleFromDateChange}
                          animateYearScrolling={false}
                          maxDate={toDate || new Date()}
                          autoOk
                        />
                      </ThemeProvider>
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl className={classes.formControlInput}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <ThemeProvider theme={theme}>
                        <DatePicker
                          label="To Date"
                          format={DATE_FORMAT}
                          value={toDate}
                          onChange={this.handleToDateChange}
                          animateYearScrolling={false}
                          maxDate={new Date()}
                          minDate={fromDate || ''}
                          autoOk
                        />
                      </ThemeProvider>
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="facility-simple">Facility Type</InputLabel>
                    <ThemeProvider theme={theme}>
                      <Select
                        value={facilityType}
                        onChange={this.handleChange('facilityType')}
                        inputProps={{
                          name: 'facility',
                          id: 'facility-simple',
                        }}
                      >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="HF">Health Facility</MenuItem>
                        <MenuItem value="EMBASSY">Embassy</MenuItem>
                        <MenuItem value="DISTRICT">Community (District)</MenuItem>
                        <MenuItem value="SECTOR">Community (Sector)</MenuItem>
                        <MenuItem value="CELL">Community (Cell)</MenuItem>
                      </Select>
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="status-simple">Status</InputLabel>
                    <ThemeProvider theme={theme}>
                      <Select
                        value={status || ''}
                        onChange={this.handleChange('status')}
                        inputProps={{
                          name: 'status',
                          id: 'status-simple',
                        }}
                      >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="APPROVED">Approved</MenuItem>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="REJECTED">Rejected</MenuItem>
                      </Select>
                    </ThemeProvider>
                  </FormControl>
                </Grid>
              </Grid>
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
                    <Button onClick={() => this.handleSearch()} style={{ width: 100 }} variant="contained" color="primary" className={classes.buttonSearch} size="small">
                      Search
                    </Button>
                  </Tooltip>
                </ClickAwayListener>
              </Grid>
              <Grid item xs={12} sm={12} align="center" className={classes.marginY1}>
                <Button onClick={() => this.handleClearFilters()} style={{ padding: 5, marginTop: 10, width: 100 }} variant="outlined" color="secondary" size="small" className={classes.buttonLink}>Clear Filters</Button>
              </Grid>
            </Grid>
          </Grid>
        </PapperBlock>
        <div>
          <EnhancedTable
            loading={loading}
            tableTitle="Users"
            page={page}
            headCells={headCells}
            rows={userApplications}
            totalData={count || 0}
            onPageChange={(newPage) => this.handlePageChange(newPage)}
            actionType="approve_reject"
            onActionClicked={(action, rowData) => this.handleAction(action, rowData)}
            download={(headers) => this.exportCsv(headers)}
          />
        </div>
        <SuccessAlert
          message={alertMessage}
          open={showAlert}
          onClose={this.handleAlertClose}
        />
        <ConfirmationAlert
          message={confirmAlertMessage}
          open={showConfirmAlert}
          onClose={this.handleAlertClose}
          onConfirm={this.handleConfirm}
          onCancel={this.handleAlertClose}
        />
        <InfoAlert
          message={infoMessage}
          open={showInfoAlert}
          onClose={this.handleInfoClose}
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
        <UserViewModal
          open={showUserViewModal}
          onClose={() => {
            this.setState({
              showUserViewModal: false
            });
          }}
          userData={actionData}
        />
        <LoadingAlert
          open={updateLoading}
        />
      </div>
    );
  }
}

UserRegisterRequest.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  updateLoading: PropTypes.bool,
  handleFetchUserApplications: PropTypes.func.isRequired,
  handleUpdateUserApplication: PropTypes.func.isRequired,
  handleUpdateUserApplicationClear: PropTypes.func.isRequired, // eslint-disable-line
  userApplications: PropTypes.array,
  count: PropTypes.number,
  userApplicationUpdated: PropTypes.string // eslint-disable-line
};

UserRegisterRequest.defaultProps = {
  userApplications: [],
  count: 0,
  userApplicationUpdated: '',
  loading: false,
  updateLoading: false
};

const userApplicationsListReducer = 'userApplicationsListReducer';
const updateUserApplicationReducer = 'updateUserApplicationReducer';
const mapStateToProps = state => ({
  loading: state.get(userApplicationsListReducer) && state.get(userApplicationsListReducer).loading ? state.get(userApplicationsListReducer).loading : false,
  userApplications: state.get(userApplicationsListReducer) && state.get(userApplicationsListReducer).userApplications ? state.get(userApplicationsListReducer).userApplications : [],
  count: state.get(userApplicationsListReducer) && state.get(userApplicationsListReducer).count ? state.get(userApplicationsListReducer).count : 0,
  userApplicationUpdated: state.get(updateUserApplicationReducer) && state.get(updateUserApplicationReducer).userApplicationUpdated ? state.get(updateUserApplicationReducer).userApplicationUpdated : '',
  updateLoading: state.get(updateUserApplicationReducer) && state.get(updateUserApplicationReducer).loading ? state.get(updateUserApplicationReducer).loading : false,
});

const mapDispatchToProps = dispatch => ({
  handleFetchUserApplications: bindActionCreators(fetchUserApplications, dispatch),
  handleUpdateUserApplication: bindActionCreators(updateUserApplication, dispatch),
  handleUpdateUserApplicationClear: bindActionCreators(updateUserApplicationClear, dispatch),
});

const UserRegisterRequestMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRegisterRequest);

export default withStyles(styles)(UserRegisterRequestMapped);
