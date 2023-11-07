import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import Typography from '@material-ui/core/Typography';
import Type from 'enl-styles/Typography.scss';
import Divider from '@material-ui/core/Divider';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import styles from './user-staus-logs-jss.js';
import EnhancedTable from '../../Pages/Table/EnhancedTable';
import { fetchUserStatusLogsList,updateData } from './userStatusLogsAction';
import ViewModal from './ViewModal';
import { ROLE } from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import { DATE_FORMAT } from '../../../lib/constants';
import ConfirmationAlert from 'enl-components/Alerts/ConfirmationAlert';
import LoadingAlert from 'enl-components/Alerts/LoadingAlert';
import SuccessAlert from 'enl-components/Alerts/SuccessAlert';
import ErrorAlert from 'enl-components/Alerts/ErrorAlert';


const headCells = [
  {
    id: 'createdAt', numeric: false, show: true, label: 'Created Date', isDate: true
  },
  {
    id: 'updatedAt', numeric: false, show: true, label: 'Updated Date', isDate: true
  },
  {
    id: 'file_name', numeric: false, show: true, label: 'File Name'
  },
  {
    id: 'release_note', numeric: false, show: true, label: 'Release note'
  },
  {
    id: 'version', numeric: false, show: true, label: 'Version'
  },
  // {
  //   id: 'documentNumber', numeric: false, show: true, label: 'Document Number'
  // },
  // {
  //   id: 'facilityType', numeric: false, show: true, label: 'Facility Type'
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
  {
    id: 'status', numeric: false, show: true, isAction: true, label: 'Status', statusType: 'switch'
  },
  {
    id: 'actions', numeric: false, show: true, isAction: true, label: 'Actions', actionType: 'view_download'
  },
  // {
  //   id: 'doneByName', numeric: false, show: true, label: 'Done By'
  // },
];

const theme = createMuiTheme({
  palette: {
    primary: lightBlue
  },
  spacing: 1
});

class UserStatusLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showViewModal: false,
      page: 1,
      limit: 20,
      surname: '',
      documentNumber: '',
      email: '',
      file_name:'',
      version:'',
      release_note:'',
      status: 0,
      fromDate: null,
      toDate: null,
      actionData: null,
      toolTipOpen: false,
      selectedItemId: '',
      selectedStatusValue: false,
      statusConfirmAlert: false,
      showSuccessModel: false,
      showLoadingModel: false,
      showErrorModel: false,
      updateType: '',
      alertMessage: '',
    };
    this.handleAction = this.handleAction.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { handleFetchUserStatusLogsList } = this.props;
    const { page, limit } = this.state;
    handleFetchUserStatusLogsList({ page, limit });
  }

  
  static getDerivedStateFromProps(nextProps, prevState) {
    const updatedState = {};
    const { updateDataStatus,handleFetchUserStatusLogsList } = nextProps;
    const { selectedStatusValue, updateType } = prevState;
    let callList = false;
    if (updateType === 'STATUS_UPDATE') {
      // console.log("updateDataStatus",updateDataStatus)
      if (updateDataStatus === 'Success') {
        updatedState.showLoadingModel = false;
        updatedState.showSuccessModel = true;
        updatedState.alertMessage = `Status updated to ${selectedStatusValue ? 'Active' : 'Inactive'}`;
        updatedState.updateType = '';
        callList = true;
      } else if (updateDataStatus === 'error') {
        updatedState.showLoadingModel = false;
        updatedState.showErrorModel = true;
        updatedState.alertMessage = `Unable to update status to ${selectedStatusValue ? 'Active' : 'Inactive'}`;
        updatedState.updateType = '';
        callList = true;
      }
    } 
    if(callList){
      const {
        page,
        limit        
      } = prevState;
      handleFetchUserStatusLogsList({ page, limit });
    }
    return updatedState;
  }

  handleAction = (action, rowData) => {
    if (action === 'view') {
      this.setState({
        showViewModal: true,
        actionData: rowData
      });
    }
    if (action === 'download') {
      console.log("rowData",rowData)
      var fileName = rowData.file_name
      var url = URL.DUMP_FILES + '?file_name=' + fileName;
      console.log("url",url)
      const fileElement = document.createElement('a');
      fileElement.href = url;
      fileElement.target = '_blank';
      fileElement.click();
    }
  }

  handleStatusChange = (rowData, value) => {
    // console.log("rowData",rowData)
    this.setState({
      selectedItemId: rowData.id,
      selectedStatusValue: value,
      statusConfirmAlert: true,
      actionData: rowData,
    });
  }

  handleOnStatusConfirm = () => {
    const { handleUpdateData } = this.props;
    const { selectedItemId, selectedStatusValue } = this.state;
    console.log("selectedStatusValue",selectedStatusValue)
    const status = selectedStatusValue ? 1 : 0;
    handleUpdateData(selectedItemId, { status });
    this.setState({
      showLoadingModel: true,
      statusConfirmAlert: false,
      updateType: 'STATUS_UPDATE',
    });
  }

  handleErrorAlertClose = () => {
    this.setState({ showErrorModel: false, alertMessage: '' });
  }

  handleAlertClose = () => {
    this.setState({ showSuccessModel: false });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
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

  handlePageChange = (newPage) => {
    const { handleFetchUserStatusLogsList } = this.props;
    const {
      limit,
      // surname,
      // documentNumber,
      // email,
      // fromDate,
      // toDate,
      file_name,
      version,
      release_note,
      status
    } = this.state;
    const params = {
      page: newPage,
      limit,
      // name: surname,
      // documentNumber,
      // email,
      // fromDate,
      // toDate,
      file_name,
      version,
      release_note,
      status: (status && status !== 'All') ? status : ''
    };
    handleFetchUserStatusLogsList(params);
    this.setState({
      page: newPage
    });
  }

  handleSearch = () => {
    const { handleFetchUserStatusLogsList } = this.props;
    const {
      limit,
      // surname,
      // documentNumber,
      // email,
      // fromDate,
      // toDate,
      file_name,
      version,
      release_note,
      status
    } = this.state;
    // if (surname || documentNumber || email || fromDate || toDate || status) {
    if (file_name || version || release_note || status) {
      const params = {
        page: 1,
        limit,
        // name: surname,
        // documentNumber,
        // email,
        // fromDate,
        // toDate,
        file_name,
        version,
        release_note,
        // status: (status && status !== 'All') ? (status==="ACTIVE"? 1 : 0  ) : ''
        status: (status && status !== 'All') ? status : ''
      };
      handleFetchUserStatusLogsList(params);
    } else {
      this.setState({ toolTipOpen: true });
    }
  }

  exportCsv = async (headers) => {
    let params = {};
    const {
      surname,
      documentNumber,
      email,
      fromDate,
      toDate,
      status
    } = this.state;
    if (surname || documentNumber || email || fromDate || toDate || status) {
      params = {
        name: surname,
        documentNumber,
        email,
        fromDate: fromDate ? moment(fromDate).format(DATE_FORMAT) : '',
        toDate: toDate ? moment(toDate).format(DATE_FORMAT) : '',
        status: (status && status !== 'All') ? status : ''
      };
    }
    params.skipPagination = true;
    const res = await API.get(URL.USER_STATUS_LOGS, { data: {}, params })
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
        let value = '';
        if (key === 'user') {
          value = row.users ? `${row.users.surName} ${row.users.postNames}` : 'N/A';
        } else if (key === 'email' || key === 'phoneNumber' || key === 'documentType' || key === 'documentNumber' || key === 'facilityType' || key === 'facilityName' || key === 'facilityArea') {
          value = row.users ? row.users[key] : 'N/A';
        } else if (key === 'doneByName') {
          const approvedBy = row.doneBy ? `${row.doneBy.surName} ${row.doneBy.postNames}` : 'N/A';
          value = row.doneBy ? `${approvedBy} (${_.startCase(_.lowerCase((row.doneBy.accessType).replace(/_/g, ' ')))})` : 'N/A';
        } else {
          value = row[key] ? row[key] : 'N/A';
        }
        if (value) {
          formatData.push(value);
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
    hiddenElement.download = `users-status-logs-${+new Date()}.csv`;
    hiddenElement.click();
  }

  handleTooltipClose = () => {
    this.setState({ toolTipOpen: false });
  };

  handleClear = () => {
    const { handleFetchUserStatusLogsList } = this.props;
    const { page, limit } = this.state;
    const params = { page, limit };
    this.setState({
      // surname: '',
      // documentNumber: '',
      // email: '',
      // fromDate: null,
      // toDate: null,
      file_name: '',
      version: '',
      release_note: '',
      status: ''
    });
    handleFetchUserStatusLogsList(params);
  }

  render() {
    const {
      classes, userStatusLogsList, count, loading
    } = this.props;
    const title = brand.name;
    const description = brand.desc;
    const {
      showViewModal,
      actionData,
      page,
      surname,
      documentNumber,
      email,
      file_name,
      version,
      release_note,
      status,
      fromDate,
      toDate,
      toolTipOpen,
      selectedStatusValue,      
      statusConfirmAlert,
      showLoadingModel,
      showSuccessModel,
      alertMessage,
      showErrorModel,
    } = this.state;

    const userStatusLogsListFormatted = [];

    userStatusLogsList.forEach((item) => {
      const tempItem = item;
      tempItem.user = '';
      if (item && item.users) {
        const userDetail = item.users;
        if (userDetail.surName && userDetail.postNames) {
          tempItem.user = `${userDetail.surName} ${userDetail.postNames}`;
        } else if (userDetail.surName) {
          tempItem.user = `${userDetail.surName}`;
        } else if (userDetail.postNames) {
          tempItem.user = `${userDetail.postNames}`;
        }
        if (userDetail.displayFacilityArea) {
          tempItem.displayFacilityArea = userDetail.displayFacilityArea;
        }
        tempItem.email = userDetail.email || '';
        tempItem.phoneNumber = userDetail.phoneNumber || '';
        tempItem.documentNumber = userDetail.documentNumber || '';
        tempItem.documentType = userDetail.documentType || '';
        tempItem.facilityType = userDetail.facilityType || '';
        tempItem.facilityName = userDetail.facilityName || '';
        tempItem.facilityArea = userDetail.facilityArea || '';
        tempItem.role = userDetail.role || '';
      }
      if (tempItem.doneBy) {
        const { doneBy } = tempItem;
        if (doneBy.surName && doneBy.postNames) {
          tempItem.doneByName = `${doneBy.surName} ${doneBy.postNames} (${ROLE[doneBy.role]})`;
        } else if (doneBy.surName) {
          tempItem.doneByName = `${doneBy.surName}`;
        } else if (doneBy.postNames) {
          tempItem.doneByName = `${doneBy.postNames}`;
        }
      }
      if (tempItem.changeStatus) {
        tempItem.status = tempItem.changeStatus;
      }
      userStatusLogsListFormatted.push(tempItem);
    });

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
            <span>Metadata Dump</span>
          </Typography>
          <Divider style={{ width: '100%' }} />
          <Grid container spacing={1}>
            <Grid container item xs={12} sm={9}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="File Name"
                        value={file_name}
                        onChange={this.handleChange('file_name')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="Release Notes"
                        value={release_note}
                        onChange={this.handleChange('release_note')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput}>
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
              <Grid container spacing={1}>
                {/* <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <ThemeProvider theme={theme}>
                        <DatePicker
                          label="From Date"
                          format="DD/MM/YYYY"
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
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <ThemeProvider theme={theme}>
                        <DatePicker
                          label="To Date"
                          format="DD/MM/YYYY"
                          value={toDate}
                          onChange={this.handleToDateChange}
                          animateYearScrolling={false}
                          maxDate={new Date()}
                          minDate={fromDate || null}
                          autoOk
                        />
                      </ThemeProvider>
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </Grid> */}                
                <Grid item xs={12} sm={4}>
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
                    <Button
                      style={{ width: 100 }}
                      variant="contained"
                      color="primary"
                      className={classes.buttonSearch}
                      size="small"
                      onClick={() => this.handleSearch()}
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
                  onClick={() => this.handleClear()}
                  className={classes.buttonLink}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </PapperBlock>
        <div>
          <EnhancedTable
            loading={loading}
            tableTitle="Metadata Dump"
            page={page}
            headCells={headCells}
            rows={userStatusLogsList}
            totalData={count || 0}
            onPageChange={(newPage) => this.handlePageChange(newPage)}
            onActionClicked={(action, rowData) => this.handleAction(action, rowData)}
            handleStatusChange={(rowData, value) => this.handleStatusChange(rowData, value)}
            onDeleteRows={(rowIds) => this.handleDeleteRows(rowIds)}
            download={(headers) => this.exportCsv(headers)}
          />
        </div>
        <ViewModal
          open={showViewModal}
          onClose={() => {
            this.setState({
              showViewModal: false
            });
          }}
          userData={actionData}
        />
        <ConfirmationAlert
          message={`Are you do you want to ${selectedStatusValue ? 'active' : 'inactive'} this data`}
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

        <SuccessAlert
          message={alertMessage}
          open={showSuccessModel}
          onClose={this.handleAlertClose}
        />

        <ErrorAlert
          message={alertMessage}
          open={showErrorModel}
          onClose={this.handleErrorAlertClose}
        />

        <LoadingAlert
          open={showLoadingModel}
        />

      </div>
    );
  }
}

UserStatusLogs.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFetchUserStatusLogsList: PropTypes.func.isRequired,
  userStatusLogsList: PropTypes.array,
  count: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  handleUpdateData: PropTypes.func.isRequired,
};

UserStatusLogs.defaultProps = {
  userStatusLogsList: [],
  updateDataStatus: '',
};

const userStatusLogsReducer = 'userStatusLogsReducer';
const mapStateToProps = state => ({
  loading: state.get(userStatusLogsReducer) && state.get(userStatusLogsReducer).loading ? state.get(userStatusLogsReducer).loading : false,
  userStatusLogsList: state.get(userStatusLogsReducer) && state.get(userStatusLogsReducer).userStatusLogsList ? state.get(userStatusLogsReducer).userStatusLogsList : [],
  count: state.get(userStatusLogsReducer) && state.get(userStatusLogsReducer).count ? state.get(userStatusLogsReducer).count : 0,
  updateDataStatus: state.get(userStatusLogsReducer) && state.get(userStatusLogsReducer).updateDataStatus ? state.get(userStatusLogsReducer).updateDataStatus : '',
});

const mapDispatchToProps = dispatch => ({
  handleFetchUserStatusLogsList: bindActionCreators(fetchUserStatusLogsList, dispatch),
  handleUpdateData: bindActionCreators(updateData, dispatch),
});

const UserStatusLogsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserStatusLogs);

export default withStyles(styles)(UserStatusLogsMapped);
