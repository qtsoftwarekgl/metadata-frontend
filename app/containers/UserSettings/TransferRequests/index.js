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
import SuccessAlert from 'enl-components/Alerts/SuccessAlert';
import ConfirmationAlert from 'enl-components/Alerts/ConfirmationAlert';
import InfoAlert from 'enl-components/Alerts/InfoAlert';
import Typography from '@material-ui/core/Typography';
import Type from 'enl-styles/Typography.scss';
import Divider from '@material-ui/core/Divider';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import ErrorAlert from 'enl-components/Alerts/ErrorAlert';
import LoadingAlert from 'enl-components/Alerts/LoadingAlert';
import styles from './transfer-request-jss';
import EnhancedTable from '../../Pages/Table/EnhancedTable';
import { fetchTransferRequestList, updateTransferData, updateTransferRequestClear } from './transferRequestActions';
import { UPDATE_STATUS, ROLE } from './constants';
import ViewModal from './ViewModal';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import { DATE_FORMAT } from '../../../lib/constants';

const headCells = [
  {
    id: 'createdAt', numeric: false, show: true, label: 'Request Date-Time', isDate: true
  },
  {
    id: 'surName', numeric: false, show: true, label: 'Surname'
  },
  {
    id: 'postNames', numeric: false, show: true, label: 'Post-Names'
  },
  {
    id: 'currentFacilityType', numeric: false, show: true, label: 'Current Facility Type'
  },
  {
    id: 'currentFacilityBy', numeric: false, show: true, label: 'Current Facility Name'
  },
  {
    id: 'displayCurrentFacilityArea', numeric: false, show: true, label: 'Current Facility Area'
  },
  {
    id: 'appliedFacilityType', numeric: false, show: true, label: 'Applied Facility Type'
  },
  {
    id: 'appliedFacilityBy', numeric: false, show: true, label: 'Applied Facility Name'
  },
  {
    id: 'displayAppliedFacilityName', numeric: false, show: true, label: 'Transfer Facility Area'
  },
  {
    id: 'role', numeric: false, show: true, label: 'Role'
  },
  {
    id: 'status', numeric: false, show: true, isAction: true, label: 'Status', statusType: 'label'
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

class TransferRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      alertMessage: '',
      showConfirmAlert: false,
      confirmAlertMessage: '',
      showInfoAlert: false,
      infoMessage: '',
      page: 1,
      limit: 20,
      transferConfirmMessage: '',
      showTransferConfirmation: false,
      showErrorAlert: false,
      errorAlertMessage: '',
      surname: '',
      currentFacilityName: '',
      status: '',
      fromDate: null,
      toDate: null,
      deleteRowsAlert: false,
      selectedId: '',
      UpdateStatus: '',
      selectedUsername: '',
      showViewModal: false,
      actionData: null,
      showLoadingModel: false,
      toolTipOpen: false
    };
    this.handleAction = this.handleAction.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleConfirmReject = this.handleConfirmReject.bind(this);
    this.handleInfoClose = this.handleInfoClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { handleFetchTransferRequestList } = this.props;
    const { page, limit } = this.state;
    handleFetchTransferRequestList({ page, limit });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const updatedState = {};
    const {
      status, handleUpdateTransferRequestClear, handleFetchTransferRequestList
    } = nextProps;
    const {
      page, limit, selectedUsername, UpdateStatus
    } = prevState;
    if (status === 'ok') {
      const params = { page, limit };
      updatedState.showAlert = true;
      updatedState.showLoadingModel = false;
      updatedState.alertMessage = `Transfer request of ${selectedUsername} ${UPDATE_STATUS[UpdateStatus]} successfully`;
      handleFetchTransferRequestList(params);
      handleUpdateTransferRequestClear();
    } else if (status === 'error') {
      updatedState.showErrorAlert = true;
      updatedState.showLoadingModel = false;
      updatedState.errorAlertMessage = 'Unable to update Transfer Request!';
      handleUpdateTransferRequestClear();
    }
    return updatedState;
  }

  handleAction = (action, rowData) => {
    if (action === 'view') {
      this.setState({
        showViewModal: true,
        actionData: rowData
      });
    } else if (action === 'approve') {
      this.setState({
        showTransferConfirmation: true,
        transferConfirmMessage: `Are you sure want to approve transfer request of ${rowData.users.surName} ${rowData.users.postNames} ?`,
        selectedId: rowData._id,
        UpdateStatus: 'APPROVED',
        selectedUsername: `${rowData.users.surName} ${rowData.users.postNames}`
      });
    } else if (action === 'reject') {
      this.setState({
        showConfirmAlert: true,
        confirmAlertMessage: `Are you sure want to reject transfer request of ${rowData.users.surName} ${rowData.users.postNames} ?`,
        selectedId: rowData._id,
        UpdateStatus: 'REJECTED',
        selectedUsername: `${rowData.users.surName} ${rowData.users.postNames}`
      });
    } else if (action === 'transfer') {
      this.setState({
        showTransferConfirmation: true
      });
    }
  }

  handleAlertClose = () => {
    this.setState({
      showAlert: false,
      alertMessage: '',
      showConfirmAlert: false,
      confirmAlertMessage: ''
    });
  }

  handleConfirmReject = () => {
    const { handleUpdateTransferData } = this.props;
    const { selectedId, UpdateStatus } = this.state;
    handleUpdateTransferData(selectedId, { status: UpdateStatus });
    this.setState({
      showConfirmAlert: false,
      showLoadingModel: true,
      confirmAlertMessage: ''
    });
  }

  handleInfoClose = () => {
    this.setState({
      showInfoAlert: false,
      infoMessage: ''
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleOnDeleteConfirm = () => {
    this.setState({
      deleteRowsAlert: false,
      showInfoAlert: true,
      infoMessage: 'Transfer requests deleted successfully.'
    });
  }

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

  handleDeleteRows = () => {
    this.setState({
      deleteRowsAlert: true
    });
  }

  handlePageChange = (newPage) => {
    const { handleFetchTransferRequestList } = this.props;
    const {
      limit,
      surname,
      currentFacilityName,
      fromDate,
      toDate,
      status,
    } = this.state;
    const params = {
      page: newPage,
      limit,
      name: surname,
      currentFacilityName,
      fromDate: fromDate ? moment(fromDate).format(DATE_FORMAT) : '',
      toDate: toDate ? moment(toDate).format(DATE_FORMAT) : '',
      status: (status && status !== 'All') ? status : ''
    };
    handleFetchTransferRequestList(params);
    this.setState({
      page: newPage
    });
  }

  handleSearch = () => {
    const { handleFetchTransferRequestList } = this.props;
    const {
      limit,
      surname,
      currentFacilityName,
      fromDate,
      toDate,
      status,
    } = this.state;
    if (surname || currentFacilityName || fromDate || toDate || status) {
      const params = {
        page: 1,
        limit,
        name: surname,
        currentFacilityName,
        fromDate,
        toDate,
        status: (status && status !== 'All') ? status : ''
      };
      handleFetchTransferRequestList(params);
    } else {
      this.setState({ toolTipOpen: true });
    }
  }

  exportCsv = async (headers) => {
    let params = {};
    const {
      surname,
      currentFacilityName,
      fromDate,
      toDate,
      status,
    } = this.state;
    if (surname || currentFacilityName || fromDate || toDate || status) {
      params = {
        name: surname,
        currentFacilityName,
        fromDate: fromDate ? moment(fromDate).format(DATE_FORMAT) : '',
        toDate: toDate ? moment(toDate).format(DATE_FORMAT) : '',
        status: (status && status !== 'All') ? status : ''
      };
    }
    params.skipPagination = true;
    const res = await API.get(URL.TRANSFER, { data: {}, params })
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
        if (key === 'surName' || key === 'postNames') {
          value = row.users[key];
        } else if (key === 'currentFacilityBy') {
          value = `${row.currentFacilityName} (${row.role})`;
        } else if (key === 'appliedFacilityBy') {
          value = `${row.appliedFacilityName} (${row.role})`;
        } else {
          value = row[key];
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
    hiddenElement.download = `transfer-request-${+new Date()}.csv`;
    hiddenElement.click();
  }

  handleTooltipClose = () => {
    this.setState({ toolTipOpen: false });
  };

  render() {
    const {
      classes, transferRequestList, listLoading, count, handleFetchTransferRequestList
    } = this.props;

    const transferRequestListFormatted = [];

    transferRequestList.forEach((item) => {
      const tempItem = item;

      tempItem.surName = item && item.users && item.users.surName;
      tempItem.postNames = item && item.users && item.users.postNames;

      if (tempItem.currentFacilityName) {
        if (tempItem.currentFacilityName && tempItem.users && tempItem.users.role) {
          tempItem.currentFacilityBy = `${tempItem.currentFacilityName} (${ROLE[tempItem.users.role]})`;
        } else if (tempItem.currentFacilityName) {
          tempItem.currentFacilityBy = `${tempItem.currentFacilityName}`;
        }
      }

      if (tempItem.appliedFacilityName) {
        if (tempItem.appliedFacilityName && tempItem.role) {
          tempItem.appliedFacilityBy = `${tempItem.appliedFacilityName} (${ROLE[tempItem.role]})`;
        } else if (tempItem.appliedFacilityName) {
          tempItem.appliedFacilityBy = `${tempItem.appliedFacilityName}`;
        }
      }

      transferRequestListFormatted.push(tempItem);
    });


    const title = brand.name;
    const description = brand.desc;
    const {
      showAlert,
      alertMessage,
      showConfirmAlert,
      confirmAlertMessage,
      infoMessage,
      showInfoAlert,
      page,
      limit,
      transferConfirmMessage,
      showTransferConfirmation,
      surname,
      currentFacilityName,
      status,
      deleteRowsAlert,
      fromDate,
      toDate,
      showErrorAlert,
      errorAlertMessage,
      showViewModal,
      showLoadingModel,
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
            <span>Transfer Requests</span>
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
                        label="Name"
                        value={surname}
                        onChange={this.handleChange('surname')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        className={classes.margin}
                        label="Current Facility Name"
                        value={currentFacilityName}
                        onChange={this.handleChange('currentFacilityName')}
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
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
                          minDate={fromDate || ''}
                          autoOk
                        />
                      </ThemeProvider>
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </Grid>
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
                  onClick={() => {
                    this.setState({
                      surname: '',
                      currentFacilityName: '',
                      fromDate: null,
                      toDate: null,
                      status: ''
                    });
                    handleFetchTransferRequestList({ page, limit });
                  }}
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
            loading={listLoading}
            tableTitle="Users"
            page={page}
            headCells={headCells}
            rows={transferRequestListFormatted}
            totalData={count || 0}
            onPageChange={(newPage) => this.handlePageChange(newPage)}
            onActionClicked={(action, rowData) => this.handleAction(action, rowData)}
            handleStatusChange={() => {}}
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
        <SuccessAlert
          message={alertMessage}
          open={showAlert}
          onClose={this.handleAlertClose}
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
              showTransferConfirmation: false,
            });
          }}
          onConfirm={() => {
            const { handleUpdateTransferData } = this.props;
            const { selectedId, UpdateStatus } = this.state;
            handleUpdateTransferData(selectedId, { status: UpdateStatus });
            this.setState({
              showTransferConfirmation: false,
              showLoadingModel: true
            });
          }}
          onCancel={() => {
            this.setState({
              showTransferConfirmation: false,
            });
          }}
        />
        <ConfirmationAlert
          message="Do you want to delete selected transfer request(s)."
          open={deleteRowsAlert}
          onClose={() => {
            this.setState({
              deleteRowsAlert: false,
            });
          }}
          onConfirm={() => this.handleOnDeleteConfirm()}
          onCancel={() => {
            this.setState({
              deleteRowsAlert: false
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
          open={showLoadingModel}
        />
      </div>
    );
  }
}

TransferRequests.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFetchTransferRequestList: PropTypes.func.isRequired,
  handleUpdateTransferData: PropTypes.func.isRequired,
  transferRequestList: PropTypes.array,
  listLoading: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired
};

TransferRequests.defaultProps = {
  transferRequestList: []
};

const transferRequestListReducer = 'transferRequestListReducer';
const mapStateToProps = state => ({
  listLoading: state.get(transferRequestListReducer) && state.get(transferRequestListReducer).listLoading ? state.get(transferRequestListReducer).listLoading : false,
  transferRequestList: state.get(transferRequestListReducer) && state.get(transferRequestListReducer).transferRequestList ? state.get(transferRequestListReducer).transferRequestList : [],
  count: state.get(transferRequestListReducer) && state.get(transferRequestListReducer).count ? state.get(transferRequestListReducer).count : 0,
  status: state.get(transferRequestListReducer) && state.get(transferRequestListReducer).status ? state.get(transferRequestListReducer).status : '',
  message: state.get(transferRequestListReducer) && state.get(transferRequestListReducer).message ? state.get(transferRequestListReducer).message : ''
});

const mapDispatchToProps = dispatch => ({
  handleFetchTransferRequestList: bindActionCreators(fetchTransferRequestList, dispatch),
  handleUpdateTransferData: bindActionCreators(updateTransferData, dispatch),
  handleUpdateTransferRequestClear: bindActionCreators(updateTransferRequestClear, dispatch)
});

const TransferRequestsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransferRequests);

export default withStyles(styles)(TransferRequestsMapped);
