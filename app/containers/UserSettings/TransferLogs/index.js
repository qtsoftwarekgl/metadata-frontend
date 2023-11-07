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
import styles from './transfer-logs-jss';
import EnhancedTable from '../../Pages/Table/EnhancedTable';
import { fetchTransferLogsList } from './transferLogsActions';
import ViewModal from './ViewModal';
import { ROLE } from './constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import { DATE_FORMAT } from '../../../lib/constants';

const headCells = [
  {
    id: 'createdAt', numeric: false, show: true, label: 'Request Date-Time', isDate: true
  },
  {
    id: 'approvedAt', numeric: false, show: true, label: 'Action Date-Time', isDate: true
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
    id: 'appliedFacilityType', numeric: false, show: true, label: 'Transfer Facility Type'
  },
  {
    id: 'appliedFacilityBy', numeric: false, show: true, label: 'Transfer Facility Name'
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
    id: 'actions', numeric: false, show: true, isAction: true, label: 'Actions', actionType: 'view'
  },
  {
    id: 'approvedByName', numeric: false, show: true, label: 'Done By'
  },
];

const theme = createMuiTheme({
  palette: {
    primary: lightBlue
  },
  spacing: 1
});

class TransferLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showViewModal: false,
      page: 1,
      limit: 20,
      surname: '',
      status: '',
      fromDate: null,
      toDate: null,
      actionData: null,
      toolTipOpen: false,
      currentFacilityName: '',
    };
    this.handleAction = this.handleAction.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { handleFetchTransferLogsList } = this.props;
    const { page, limit } = this.state;
    handleFetchTransferLogsList({ page, limit });
  }

  handleAction = (action, rowData) => {
    if (action === 'view') {
      this.setState({
        showViewModal: true,
        actionData: rowData
      });
    }
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
    const { handleFetchTransferLogsList } = this.props;
    const {
      limit,
      surname,
      currentFacilityName,
      fromDate,
      toDate,
      status
    } = this.state;
    const params = {
      page: newPage,
      limit,
      name: surname,
      currentFacilityName,
      fromDate,
      toDate,
      status
    };
    handleFetchTransferLogsList(params);
    this.setState({
      page: newPage
    });
  }

  handleSearch = () => {
    const { handleFetchTransferLogsList } = this.props;
    const {
      limit,
      surname,
      currentFacilityName,
      fromDate,
      toDate,
      status
    } = this.state;
    if (surname || currentFacilityName || fromDate || toDate || status) {
      const params = {
        page: 1,
        limit,
        name: surname,
        currentFacilityName,
        fromDate,
        toDate,
        status
      };
      handleFetchTransferLogsList(params);
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
        fromDate: fromDate ? moment(fromDate).format(DATE_FORMAT) : '',
        toDate: toDate ? moment(toDate).format(DATE_FORMAT) : '',
        status
      };
    }
    params.skipPagination = true;
    const res = await API.get(URL.TRANSFER_LOGS, { data: {}, params })
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
        } else if (key === 'approvedByName') {
          const approvedBy = `${row.approvedBy.surName} ${row.approvedBy.postNames}`;
          value = `${approvedBy} (${_.startCase(_.lowerCase((row.approvedBy.accessType).replace(/_/g, ' ')))})`;
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
    hiddenElement.download = `transfer-logs-${+new Date()}.csv`;
    hiddenElement.click();
  }

  handleTooltipClose = () => {
    this.setState({ toolTipOpen: false });
  };

  render() {
    const {
      classes, transferLogsList, count, handleFetchTransferLogsList, loading
    } = this.props;
    const title = brand.name;
    const description = brand.desc;
    const {
      showViewModal,
      actionData,
      page,
      limit,
      surname,
      currentFacilityName,
      status,
      fromDate,
      toDate,
      toolTipOpen
    } = this.state;

    const transferLogsListFormatted = [];

    transferLogsList.forEach((item) => {
      const tempItem = item;
      tempItem.surName = item && item.users && item.users.surName;
      tempItem.postNames = item && item.users && item.users.postNames;
      tempItem.approvedByName = '';
      if (tempItem.approvedBy) {
        const approver = tempItem.approvedBy;
        if (approver.surName && approver.postNames) {
          tempItem.approvedByName = `${approver.surName} ${approver.postNames} (${ROLE[approver.role]})`;
        } else if (approver.surName) {
          tempItem.approvedByName = `${approver.surName}`;
        } else if (approver.postNames) {
          tempItem.approvedByName = `${approver.postNames}`;
        }
      }
      if (tempItem.currentFacilityName) {
        if (tempItem.currentFacilityName && tempItem.users.role) {
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
      transferLogsListFormatted.push(tempItem);
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
            <span>Transfer Logs</span>
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
                          minDate={fromDate || null}
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
                        <MenuItem value="">
                          <em>All</em>
                        </MenuItem>
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
                    const params = { page, limit };
                    this.setState({
                      surname: '',
                      currentFacilityName: '',
                      fromDate: null,
                      toDate: null,
                      status: ''
                    });
                    handleFetchTransferLogsList(params);
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
            loading={loading}
            tableTitle="Users"
            page={page}
            headCells={headCells}
            rows={transferLogsListFormatted}
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
      </div>
    );
  }
}

TransferLogs.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFetchTransferLogsList: PropTypes.func.isRequired,
  transferLogsList: PropTypes.array,
  count: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired
};

TransferLogs.defaultProps = {
  transferLogsList: []
};

const transferLogsReducer = 'transferLogsReducer';
const mapStateToProps = state => ({
  loading: state.get(transferLogsReducer) && state.get(transferLogsReducer).loading ? state.get(transferLogsReducer).loading : false,
  transferLogsList: state.get(transferLogsReducer) && state.get(transferLogsReducer).transferLogsList ? state.get(transferLogsReducer).transferLogsList : [],
  count: state.get(transferLogsReducer) && state.get(transferLogsReducer).count ? state.get(transferLogsReducer).count : 0,
});

const mapDispatchToProps = dispatch => ({
  handleFetchTransferLogsList: bindActionCreators(fetchTransferLogsList, dispatch),
});

const TransferLogsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransferLogs);

export default withStyles(styles)(TransferLogsMapped);
