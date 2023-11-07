import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightBlue } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import _ from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import Popover from '@material-ui/core/Popover';
import ErrorAlert from 'enl-components/Alerts/ErrorAlert';
import EnhancedTable from '../../Pages/Table/EnhancedTable';
import { fetchRoles } from '../../App/CommonRedux/roleActions';
import { fetchHealthFacilities } from '../../App/CommonRedux/healthFacilityActions';
import { fetchEmbassies } from '../../App/CommonRedux/embassyActions';
import { fetchProvinces } from '../../App/CommonRedux/provinceActions';
import { fetchDistricts } from '../../App/CommonRedux/districtActions';
import { fetchSectors } from '../../App/CommonRedux/sectorActions';
import { fetchCells } from '../../App/CommonRedux/cellActions';
import { transferRequestPending, transferRequestPendingClear } from './transferRequestActions';
import { MINISTRIES, REGEX, LIMIT } from '../../../lib/constants';
import TermsAndConditions from './termsAndCOnditions';
import { workerLogHistoryList } from './userListActions';
import * as URL from '../../../lib/apiUrls';
import API from '../../../config/axiosConfig';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 1100,
      minWidth: 1100
    },
    '& .MuiDialogContent-root': {
      overflowY: 'initial'
    },
    '& .MuiDialog-paper': {
      overflowY: 'initial'
    }
  },
  titleRoot: {
    marginBottom: 10
  },
  workingAt: {
    fontWeight: 'bold'
  },
  radioLabel: {
    '& .MuiTypography-root': {
      fontSize: 14
    }
  },
  formControl: {
    padding: 5,
    minWidth: '100%'
  },
  formControlInput: {
    width: '100%',
    '& label + div input': {
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 0,
      paddingRight: 0
    },
    padding: 14
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: lightBlue
  },
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: '#db3131',
        '&$error': {
          color: '#db3131'
        },
      }
    }
  },
  spacing: 1
});

const UserActionModal = (props) => {
  const classes = useStyles();
  const {
    open,
    onClose,
    onAction,
    userData,
    roles,
    healthFacilities,
    embassies,
    provinces,
    districts,
    sectors,
    cells,
    handleFetchRoles,
    handleFetchHealthFacilities,
    handleFetchEmbassies,
    handleFetchProvinces,
    handleFetchDistricts,
    handleFetchSectors,
    handleFetchCells,
    handleTransferRequestPending,
    workerHistoryList,
    workerLogsCount,
    workerLogsLoading,
    handleWorkerLogHistoryList,
    transferReqPending,
    handleTransferRequestPendingClear
  } = props;

  let infoBtn = null;
  const roleValue = userData && userData.role && (userData.role === 'NOTIFIER' || userData.role === 'CR') ? 'transfer' : 'passwordReset';
  const [value, setValue] = useState(roleValue);
  const [reasonForTransfer, setReasonForTransfer] = useState('');
  const [role, setRole] = useState('');
  const [ministry, setMinistry] = useState('');
  const [healthFacility, setHealthFacility] = useState('');
  const [selectedFacility, setFacility] = useState(null);
  const [selectedEmbassy, setEmbassyValue] = useState(null);
  const [embassy, setEmbassy] = useState('');
  const [position, setPosition] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [sector, setSector] = useState('');
  const [cell, setCell] = useState('');
  const [validatingTransfer, setValidatingTransfer] = useState(false);
  const [reasonForTransferError, setReasonForTransferError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [ministryError, setMinistryError] = useState('');
  const [healthFacilityError, setHealthFacilityError] = useState('');
  const [embassyError, setEmbassyError] = useState('');
  const [provinceError, setProvinceError] = useState('');
  const [districtError, setDistrictError] = useState('');
  const [sectorError, setSectorError] = useState('');
  const [cellError, setCellError] = useState('');
  const [validatingPassword, setValidatingPassword] = useState(false);
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [validatingPhone, setValidatingPhone] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showedPassInfo, setShowedPassInfo] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [provinceObj, setProvinceObj] = useState(null);
  const [districtObj, setDistrictObj] = useState(null);
  const [sectorObj, setSectorObj] = useState(null);
  const [cellObj, setCellObj] = useState(null);
  const [districtsOptions, setDistrictsOptions] = useState([]);
  const [sectorsOptions, setSectorsOptions] = useState([]);
  const [cellsOptions, setCellsOptions] = useState([]);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [sectorLoading, setSectorLoading] = useState(false);
  const [cellLoading, setCellLoading] = useState(false);
  const [alreadyTransfered, setAlreadyTransfered] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    handleFetchRoles();
    handleFetchHealthFacilities();
    handleFetchEmbassies();
    handleFetchProvinces();
  }, []);

  useEffect(() => {
    const userId = userData && userData._id ? userData._id : null;
    if (open) {
      handleTransferRequestPending(userId);
      const params = {
        limit: LIMIT,
        page
      };
      handleWorkerLogHistoryList(userId, params);
    } else if (!open) {
      setAlreadyTransfered(false);
      setReasonForTransferError('');
      setRoleError('');
      setMinistryError('');
      setHealthFacilityError('');
      setEmbassyError('');
      setProvinceError('');
      setDistrictError('');
      setSectorError('');
      setCellError('');
    }
  }, [userData, open]);

  useEffect(() => {
    if (transferReqPending && transferReqPending) {
      setAlreadyTransfered(true);
      handleTransferRequestPendingClear();
    }
  }, [transferReqPending, alreadyTransfered]);

  useEffect(() => {
    if (userData) {
      setMinistry(userData.ministry);
      setRole(userData.accessType);
      setEmail(userData.email);
      setPhoneNumber(userData.phoneNumber);
    }
    const sectionValue = userData && userData.role && (userData.role === 'NOTIFIER' || userData.role === 'CR') ? 'transfer' : 'passwordReset';
    setValue(sectionValue);
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setConfirmPasswordError('');
    setReasonForTransfer('');
    setHealthFacility('');
    setEmbassy('');
    setPosition('');
    setInstitutionName('');
    setProvince('');
    setDistrict('');
    setSector('');
    setCell('');
    setValidatingPassword(false);
    setValidatingEmail(false);
    setValidatingPhone(false);
    setValidatingTransfer(false);
    setShowedPassInfo(true);
  }, [open]);

  const validateTransferData = () => {
    let valid = true;
    setReasonForTransferError('');
    setRoleError('');
    setMinistryError('');
    setHealthFacilityError('');
    setEmbassyError('');
    setProvinceError('');
    setDistrictError('');
    setSectorError('');
    setCellError('');
    if (!reasonForTransfer) {
      valid = false;
      setReasonForTransferError('Please enter reason for transfer');
    }
    if (!role) {
      valid = false;
      setRoleError('Please select role.');
    }
    if ((role === 'NOTIFIER_HF' || role === 'CR_HF') && healthFacility === '') {
      valid = false;
      setHealthFacilityError('Please select health facility.');
    }
    if ((role === 'NOTIFIER_EMBASSY' || role === 'CR_EMBASSY') && embassy === '') {
      valid = false;
      setEmbassyError('Please select embassy.');
    }
    if ((role === 'NOTIFIER_DISTRICT' || role === 'CR_DISTRICT'
    || role === 'NOTIFIER_SECTOR' || role === 'CR_SECTOR' || role === 'CR_CELL')) {
      if (province === '') {
        valid = false;
        setProvinceError('Please select a province.');
      }
      if (district === '') {
        valid = false;
        setDistrictError('Please select a district.');
      }
    }
    if (role === 'NOTIFIER_SECTOR' || role === 'CR_SECTOR' || role === 'CR_CELL') {
      if (sector === '') {
        valid = false;
        setSectorError('Please select sector.');
      }
    }
    if (role === 'CR_CELL' && cell === '') {
      valid = false;
      setCellError('Please select cell.');
    }
    return valid;
  };

  const validateEmail = () => {
    let valid = true;
    if (!REGEX.EMAIL.test(email)) {
      valid = false;
      setEmailError('Please enter valid email.');
    }
    if (valid) {
      setEmailError('');
    }
    return valid;
  };

  const validatePhone = () => {
    let valid = true;
    if (ministry !== 'MINAFFET' && !REGEX.PHONE.test(phoneNumber)) {
      valid = false;
      setPhoneNumberError('Please enter valid phone number. eg: 072xxxxxxx, 073xxxxxxx, 078xxxxxxx or 079xxxxxxx');
    } else if (!phoneNumber) {
      valid = false;
      setPhoneNumberError('Please enter valid phone number. Numbers and ()+- only allowed.');
    } else if (!REGEX.PHONE_EMBASSY.test(phoneNumber)) {
      valid = false;
      setPhoneNumberError('Please enter valid phone number. Numbers and ()+- only allowed.');
    }
    if (valid) {
      setPhoneNumberError('');
    }
    return valid;
  };

  useEffect(() => {
    if (validatingTransfer) {
      validateTransferData();
    }
  }, [reasonForTransfer, role, healthFacility, embassy, province, district, sector, cell]);

  const validatePassword = () => {
    setPasswordError('');
    setConfirmPasswordError('');
    let valid = true;
    if (!REGEX.PASSWORD.test(password)) {
      valid = false;
      if (showedPassInfo) {
        setShowedPassInfo(false);
        infoBtn.click();
      }
      setPasswordError('Please enter strong password.');
    }
    if (!confirmPassword) {
      valid = false;
      setConfirmPasswordError('Please enter confirm password.');
    }
    if (password && confirmPassword && password !== confirmPassword) {
      valid = false;
      setConfirmPasswordError('Password and confirm passwod must be equal.');
    }
    return valid;
  };

  useEffect(() => {
    if (validatingPassword) {
      validatePassword();
    }
  }, [password, confirmPassword]);

  const handleValueChange = (selectedValue) => {
    if (selectedValue !== 'profile') {
      setEmailError('');
      setPhoneNumberError('');
    } else if (selectedValue === 'profile') {
      setValidatingEmail(true);
      setValidatingPhone(true);
    }
    setValue(selectedValue);
  };

  const handleEmailChange = (selectedValue) => {
    setEmail(selectedValue);
  };

  const handlePhoneNumberChange = (selectedValue) => {
    if (ministry !== 'MINAFFET' && REGEX.PHONE.test(selectedValue)) {
      setPhoneNumber(selectedValue);
    } else if (REGEX.PHONE_EMBASSY.test(selectedValue)) {
      setPhoneNumber(selectedValue);
    }
  };

  useEffect(() => {
    if (validatingEmail) {
      validateEmail();
    }
  }, [email]);

  useEffect(() => {
    if (validatingPhone) {
      validatePhone();
    }
  }, [phoneNumber]);

  const handleAction = (action, data) => {
    const tempData = data;
    if (action === 'transfer') {
      if (alreadyTransfered) {
        setShowErrorAlert(true);
        setErrorAlertMessage('There is a already pending transfer request for this user.');
      } else if (validateTransferData()) {
        setValidatingTransfer(false);
        const selectedRole = _.find(roles, { value: role });
        const transferData = {
          currentAccessType: data.accessType,
          appliedAccessType: role,
          role: selectedRole.role,
          ministry,
          currentFacility: data.facilityId,
          appliedFacility: '',
          transferReason: reasonForTransfer,
          userId: data._id,
          name: `${data.surName} ${data.postNames}`
        };
        if ((role === 'NOTIFIER_HF' || role === 'CR_HF') && ministry === 'MOH') {
          transferData.appliedFacility = healthFacility;
        } else if ((role === 'NOTIFIER_EMBASSY' || role === 'CR_EMBASSY') && ministry === 'MINAFFET') {
          transferData.appliedFacility = embassy;
        } else if ((role === 'NOTIFIER_DISTRICT' || role === 'CR_DISTRICT') && ministry === 'MINALOC') {
          transferData.appliedFacility = district;
        } else if ((role === 'NOTIFIER_SECTOR' || role === 'CR_SECTOR') && ministry === 'MINALOC') {
          transferData.appliedFacility = sector;
        } else if (role === 'CR_CELL' && ministry === 'MINALOC') {
          transferData.appliedFacility = cell;
        }
        if (role === tempData.accessType && transferData.appliedFacility === data.facilityId) {
          setShowErrorAlert(true);
          setErrorAlertMessage('The user should not be transferred to the same facility.');
        } else {
          onAction(value, transferData);
        }
      } else {
        setValidatingTransfer(true);
      }
    } else if (action === 'passwordReset') {
      if (validatePassword()) {
        setValidatingPassword(false);
        tempData.password = password;
        onAction(value, tempData);
      } else {
        setValidatingPassword(true);
      }
    } else if (action === 'profile') {
      const validEmail = validateEmail();
      const validPhone = validatePhone();
      if (validPhone && validEmail) {
        setValidatingEmail(false);
        setValidatingPhone(false);
        tempData.email = email;
        tempData.phoneNumber = phoneNumber;
        onAction(value, tempData);
      }
      if (!validEmail) { setValidatingEmail(true); }
      if (!validPhone) { setValidatingPhone(true); }
    } else if (action === 'termsAndConditions') {
      onClose();
    }
  };

  const headCells = [
    {
      id: 'fromDate', numeric: false, show: true, label: 'From Date', isDate: true
    },
    {
      id: 'toDate', numeric: false, show: true, label: 'To Date', isWorkLogDate: true
    },
    {
      id: 'facilityType', numeric: false, show: true, label: 'Facility Type'
    },
    {
      id: 'facilityName', numeric: false, show: true, label: 'Facility Name'
    },
    {
      id: 'facilityArea', numeric: false, show: true, label: 'Facility Area'
    },
    {
      id: 'role', numeric: false, show: true, label: 'Role'
    },
    {
      id: 'ministry', numeric: false, show: true, label: 'Ministry'
    },
  ];

  useEffect(() => {
    const options = districts ? districts.map(item => ({ value: item._id, label: item.name })) : [];
    setDistrictsOptions(options);
    setDistrictLoading(false);
  }, [districts]);

  useEffect(() => {
    const options = sectors ? sectors.map(item => ({ value: item._id, label: item.name })) : [];
    setSectorsOptions(options);
    setSectorLoading(false);
  }, [sectors]);

  useEffect(() => {
    const options = cells ? cells.map(item => ({ value: item._id, label: item.name })) : [];
    setCellsOptions(options);
    setCellLoading(false);
  }, [cells]);

  const handleChange = (selected, actionType, name) => {
    const { action } = actionType;
    if (name === 'province') {
      if (action === 'clear') {
        setProvinceObj(null);
        setProvince('');
      } else {
        setProvince(selected.value);
        setProvinceObj(selected);
        setDistrictLoading(true);
        handleFetchDistricts(selected.value);
      }
      setDistrict('');
      setSector('');
      setCell('');
      setDistrictObj(null);
      setSectorObj(null);
      setCellObj(null);
      setDistrictsOptions([]);
      setSectorsOptions([]);
      setCellsOptions([]);
    }
    if (name === 'district') {
      if (action === 'clear') {
        setDistrictObj(null);
        setDistrict('');
      } else {
        setDistrict(selected.value);
        setDistrictObj(selected);
        setSectorLoading(true);
        handleFetchSectors(selected.value);
      }
      setSector('');
      setCell('');
      setSectorObj(null);
      setCellObj(null);
      setSectorsOptions([]);
      setCellsOptions([]);
    }
    if (name === 'sector') {
      if (action === 'clear') {
        setSectorObj(null);
        setSector('');
      } else {
        setSector(selected.value);
        setSectorObj(selected);
        setCellLoading(true);
        handleFetchCells(selected.value);
      }
      setCell('');
      setCellObj(null);
      setCellsOptions([]);
    }
    if (name === 'cell') {
      if (action === 'clear') {
        setCellObj(null);
        setCell('');
      } else {
        setCell(selected.value);
        setCellObj(selected);
      }
    }
  };

  const handleChangeRole = name => event => {
    if (name === 'role') {
      setRole(event.target.value);
      setHealthFacility('');
      setEmbassy('');
      setPosition('');
      setInstitutionName('');
      setProvince('');
      setDistrict('');
      setSector('');
      setCell('');
    }
  };

  const handleCancel = () => {
    setValue('transfer');
    setEmail('');
    setEmailError('');
    setPhoneNumberError('');
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setConfirmPasswordError('');
    setReasonForTransfer('');
    setRole('');
    setMinistry('');
    setHealthFacility('');
    setEmbassy('');
    setPosition('');
    setInstitutionName('');
    setProvince('');
    setDistrict('');
    setSector('');
    setCell('');
    setValidatingPassword(false);
    setValidatingEmail(false);
    setValidatingPhone(false);
    setValidatingTransfer(false);
    onClose();
  };

  const handlePageChange = (newPage) => {
    const userId = userData && userData._id ? userData._id : null;
    const params = {
      page,
      limit: LIMIT
    };
    handleWorkerLogHistoryList(userId, params);
    setPage(newPage);
  };

  const getHealthFacilities = async (name) => {
    if (name && name.length > 2) {
      const params = { name };
      const res = await API.get(`${URL.HEALTH_FACILITIES}?fields=name,status`, { params })
        .then(async (response) => {
          const result = response.data;
          const data = await result.map(item => ({ value: item._id, label: item.name }));
          return data;
        })
        .catch((error) => {
          console.log(error);
        });
      return res;
    }
    return [];
  };

  const getEmbassies = async (name) => {
    if (name && name.length > 2) {
      const params = { name };
      const res = await API.get(`${URL.EMBASSIES}?fields=name,cityName,status`, { params })
        .then(async (response) => {
          const result = response.data;
          return result.map(item => ({ value: item._id, label: `${item.name} (${item.cityName})` }));
        })
        .catch((error) => {
          console.log(error);
        });
      return res;
    }
    return [];
  };

  const handleChangeFacility = (selected, accessType, type) => {
    const { action } = accessType;
    if (action === 'clear') {
      if (type === 'MOH') {
        setHealthFacility('');
        setFacility(null);
      } else if (type === 'MINAFFET') {
        setEmbassy('');
        setEmbassyValue(null);
      }
    } else if (type === 'MOH') {
      setHealthFacility(selected.value);
      setFacility(selected);
      setHealthFacilityError('');
    } else if (type === 'MINAFFET') {
      setEmbassy(selected.value);
      setEmbassyValue(selected);
      setEmbassyError('');
    }
  };

  const provincesOptions = provinces ? provinces.map(item => ({ value: item._id, label: item.name })) : [];
  const healthFacilitiesOptions = healthFacilities ? healthFacilities.map(item => ({ value: item._id, label: item.name })) : [];
  const embassiesOptions = embassies ? embassies.map(item => ({ value: item._id, label: `${item.name} (${item.cityName})` })) : [];
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleCancel()}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        className={classes.root}
      >
        <DialogTitle id="scroll-dialog-title" className={classes.titleRoot}>
          {userData && userData.surName ? userData.surName : ''}
          {' '}
          {userData && userData.postNames ? userData.postNames : ''}
        </DialogTitle>
        <DialogContent>
          <div className={classes.workingAt}>
            {'Working at: '}
            {userData && userData.facilityName ? userData.facilityName : ''}
            {' as '}
            {userData && userData.role ? userData.role : ''}
          </div>
          <div>
            <FormControl component="fieldset" required className={classes.formControl}>
              <RadioGroup
                aria-label="option"
                name="option1"
                className={classes.group}
                value={value}
                onChange={(evt) => handleValueChange(evt.target.value)}
                style={{ display: 'inline' }}
              >
                {userData && userData.role && (userData.role === 'NOTIFIER' || userData.role === 'CR') ? (<FormControlLabel className={classes.radioLabel} value="transfer" control={<Radio />} label="Transfer" style={{ fontSize: 10 }} />) : null}
                {userData && userData.role && (userData.role === 'NOTIFIER' || userData.role === 'CR') ? (<FormControlLabel className={classes.radioLabel} value="workHistory" control={<Radio />} label="Work History" />) : null}
                <FormControlLabel className={classes.radioLabel} value="passwordReset" control={<Radio />} label="Password Reset" />
                <FormControlLabel className={classes.radioLabel} value="termsAndConditions" control={<Radio />} label="Terms and Conditions Download" />
                <FormControlLabel className={classes.radioLabel} value="profile" control={<Radio />} label="Profile" />
              </RadioGroup>
            </FormControl>
          </div>
          {value === 'transfer'
            ? (
              <div>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <FormControl className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          error={reasonForTransferError !== ''}
                          helperText={reasonForTransferError}
                          value={reasonForTransfer}
                          onChange={(e) => setReasonForTransfer(e.target.value)}
                          id="outlined-full-width"
                          label="Reason for Transfer"
                          placeholder="Reason for Transfer"
                          fullWidth
                          margin="normal"
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid container item xs={12} sm={12}>
                    <Grid item xs={12} sm={4}>
                      <FormControl className={classes.formControl} error={roleError !== ''}>
                        <InputLabel htmlFor="age-simple">Role</InputLabel>
                        <ThemeProvider theme={theme}>
                          <Select
                            value={role}
                            onChange={handleChangeRole('role')}
                            inputProps={{
                              name: 'role',
                              id: 'role-simple',
                            }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {
                              roles.filter(item => item.ministry === ministry).map(item => (item.role === 'NOTIFIER' || item.role === 'CR' ? (
                                <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                              ) : null)
                              )
                            }
                          </Select>
                        </ThemeProvider>
                        <FormHelperText>{roleError}</FormHelperText>
                      </FormControl>

                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl className={classes.formControl} error={ministryError !== ''}>
                        <InputLabel htmlFor="ministry-simple">Ministry</InputLabel>
                        <ThemeProvider theme={theme}>
                          <Select
                            value={ministry}
                            onChange={(evt) => setMinistry(evt.target.value)}
                            inputProps={{
                              name: 'ministry',
                              id: 'ministry-simple',
                              readOnly: true
                            }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {
                              MINISTRIES.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)
                            }
                          </Select>
                        </ThemeProvider>
                        <FormHelperText>{ministryError}</FormHelperText>
                      </FormControl>
                    </Grid>
                    {role === 'NOTIFIER_HF' || role === 'CR_HF'
                      ? (
                        <Grid item xs={12} sm={4} style={{ marginTop: 12 }}>
                          <InputLabel htmlFor="age-simple" style={{ marginLeft: 5 }}>Health Facility List</InputLabel>
                          <FormControl className={classes.formControl} error={healthFacilityError !== ''}>
                            <AsyncSelect
                              loadOptions={(item) => getHealthFacilities(item)}
                              isClearable
                              defaultOptions={healthFacilitiesOptions}
                              value={selectedFacility}
                              onChange={(selected, action) => handleChangeFacility(selected, action, 'MOH')}
                            />
                            <FormHelperText>{healthFacilityError}</FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : null}
                    {role === 'NOTIFIER_EMBASSY' || role === 'CR_EMBASSY'
                      ? (
                        <Grid item xs={12} sm={4} style={{ marginTop: 12 }}>
                          <InputLabel htmlFor="age-simple" style={{ marginLeft: 5 }}>Embassy List</InputLabel>
                          <FormControl className={classes.formControl} error={embassyError !== ''}>
                            <AsyncSelect
                              loadOptions={(item) => getEmbassies(item)}
                              isClearable
                              defaultOptions={embassiesOptions}
                              value={selectedEmbassy}
                              onChange={(selected, action) => handleChangeFacility(selected, action, 'MINAFFET')}
                            />
                            <FormHelperText>{embassyError}</FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : null}
                  </Grid>
                  <Grid container item xs={12} sm={12}>
                    {role === 'LAUNCHER'
                      ? (
                        <Grid item xs={12} sm={4}>
                          <FormControl className={classes.formControlInput}>
                            <ThemeProvider theme={theme}>
                              <TextField
                                required
                                className={classes.margin}
                                label="Position"
                                value={position}
                                onChange={(evt) => setPosition(evt.target.value)}
                              />
                            </ThemeProvider>
                          </FormControl>
                        </Grid>
                      )
                      : null}
                    {role === 'LAUNCHER'
                      ? (
                        <Grid item xs={12} sm={4}>
                          <FormControl className={classes.formControlInput}>
                            <ThemeProvider theme={theme}>
                              <TextField
                                required
                                className={classes.margin}
                                label="Institution Name"
                                value={institutionName}
                                onChange={(evt) => setInstitutionName(evt.target.value)}
                              />
                            </ThemeProvider>
                          </FormControl>
                        </Grid>
                      )
                      : null}
                    {role === 'NOTIFIER_DISTRICT' || role === 'NOTIFIER_SECTOR'
                      || role === 'CR_DISTRICT' || role === 'CR_SECTOR' || role === 'CR_CELL'
                      ? (
                        <Grid item xs={12} sm={3}>
                          <InputLabel>
                            <span style={{ paddingLeft: 5 }}>Resident Province</span>
                            <span style={{ color: '#db3131' }}>*</span>
                          </InputLabel>
                          <FormControl fullWidth className={classes.formControl} error={provinceError !== ''}>
                            <ReactSelect
                              value={provinceObj}
                              options={provincesOptions}
                              isClearable
                              onChange={(selected, action) => { handleChange(selected, action, 'province'); }}
                            />
                            <FormHelperText>{provinceError}</FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : null}
                    {role === 'NOTIFIER_DISTRICT' || role === 'NOTIFIER_SECTOR'
                    || role === 'CR_DISTRICT' || role === 'CR_SECTOR' || role === 'CR_CELL'
                      ? (
                        <Grid item xs={12} sm={3}>
                          <InputLabel>
                            <span style={{ paddingLeft: 5 }}>Resident District</span>
                            <span style={{ color: '#db3131' }}>*</span>
                          </InputLabel>
                          <FormControl fullWidth className={classes.formControl} error={districtError !== ''}>
                            <ReactSelect
                              value={districtObj}
                              options={districtsOptions}
                              isClearable
                              isLoading={districtLoading}
                              onChange={(selected, action) => { handleChange(selected, action, 'district'); }}
                            />
                            <FormHelperText>{districtError}</FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : null}
                    {role === 'NOTIFIER_SECTOR' || role === 'CR_SECTOR' || role === 'CR_CELL'
                      ? (
                        <Grid item xs={12} sm={3}>
                          <InputLabel>
                            <span style={{ paddingLeft: 5 }}>Resident Sector</span>
                            <span style={{ color: '#db3131' }}>*</span>
                          </InputLabel>
                          <FormControl fullWidth className={classes.formControl} error={sectorError !== ''}>
                            <ReactSelect
                              value={sectorObj}
                              isLoading={sectorLoading}
                              options={sectorsOptions}
                              isClearable
                              onChange={(selected, action) => { handleChange(selected, action, 'sector'); }}
                            />
                            <FormHelperText>{sectorError}</FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : null}
                    {role === 'CR_CELL'
                      ? (
                        <Grid item xs={12} sm={3}>
                          <InputLabel>
                            <span style={{ paddingLeft: 5 }}>Resident Cell</span>
                            <span style={{ color: '#db3131' }}>*</span>
                          </InputLabel>
                          <FormControl fullWidth className={classes.formControl} error={cellError !== ''}>
                            <ReactSelect
                              value={cellObj}
                              isLoading={cellLoading}
                              options={cellsOptions}
                              isClearable
                              onChange={(selected, action) => { handleChange(selected, action, 'cell'); }}
                            />
                            <FormHelperText>{sectorError}</FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : null}
                  </Grid>
                </Grid>
              </div>
            )
            : null}
          {value === 'passwordReset'
            ? (
              <div>
                <Grid container spacing={1}>
                  <Grid item xs={10} sm={6}>
                    <FormControl className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          error={passwordError !== ''}
                          helperText={passwordError}
                          id="outlined-full-width"
                          label="New Password"
                          placeholder="New Password"
                          fullWidth
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2} sm={2}>
                    <Tooltip
                      title="Strong password details"
                      style={{
                        marginTop: 35, marginLeft: -15, color: 'red', padding: 0
                      }}
                    >
                      <IconButton
                        aria-label="password-info"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        ref={(btnRef) => { infoBtn = btnRef; }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Popover
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <div style={{ padding: 10 }}>
                        <p style={{ fontWeight: '600' }}>Password must be.</p>
                        <ol>
                          <li>10-16 characters length.</li>
                          <li>Atleast one uppercase.</li>
                          <li>Atleast one lowercase.</li>
                          <li>Atleast one number.</li>
                          <li>Atleast any one of the symbols !@#$%^&*_</li>
                        </ol>
                      </div>
                    </Popover>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          error={confirmPasswordError !== ''}
                          helperText={confirmPasswordError}
                          id="outlined-full-width"
                          label="Confirm New Password"
                          placeholder="Confirm New Password"
                          fullWidth
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
            )
            : null}
          {value === 'workHistory' ? (
            <div>
              <EnhancedTable
                loading={workerLogsLoading}
                hideToolbar
                tableTitle="WokersLogs"
                headCells={headCells}
                rows={workerHistoryList}
                page={page}
                totalData={workerLogsCount || 0}
                onPageChange={(newPage) => handlePageChange(newPage)}
              />
            </div>
          ) : null}
          {value === 'termsAndConditions'
            ? (
              <TermsAndConditions userData={userData} />
            )
            : null}
          {value === 'profile' ? (
            <div>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput} error={emailError !== ''}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        required
                        error={emailError !== ''}
                        helperText={emailError}
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        id="outlined-full-width"
                        label="Email"
                        placeholder="Email"
                        fullWidth
                        margin="normal"
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <FormControl className={classes.formControlInput} error={phoneNumberError !== ''}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        required
                        error={phoneNumberError !== ''}
                        helperText={phoneNumberError}
                        value={phoneNumber}
                        onChange={(e) => handlePhoneNumberChange(e.target.value)}
                        id="outlined-full-width"
                        label="Telephone Number"
                        placeholder="Telephone Number"
                        fullWidth
                        margin="normal"
                      />
                    </ThemeProvider>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          {value !== 'termsAndConditions'
            ? (
              <Button onClick={() => handleCancel()} color="primary" variant="outlined">
                {value === 'workHistory' ? 'Close' : ' Cancel'}
              </Button>
            ) : null
          }
          {value !== 'termsAndConditions' && value !== 'workHistory' ? (
            <Button
              onClick={() => handleAction(value, userData)}
              color="primary"
              variant="contained"
            >
              {value === 'transfer' ? 'Transfer' : ''}
              {value === 'passwordReset' ? 'Reset' : ''}
              {value === 'profile' ? 'Save' : ''}
            </Button>
          ) : null}
          {value === 'termsAndConditions' ? (
            <Button onClick={() => handleCancel()} color="primary" style={{ marginRight: '12%' }} variant="outlined">
              {value === 'workHistory' ? 'Close' : ' Cancel'}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
      <ErrorAlert
        message={errorAlertMessage}
        open={showErrorAlert}
        onClose={() => {
          setShowErrorAlert(false);
          setErrorAlertMessage('');
        }}
      />
    </div>
  );
};

UserActionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
  userData: PropTypes.object,
  handleFetchRoles: PropTypes.func.isRequired,
  handleFetchHealthFacilities: PropTypes.func.isRequired,
  handleFetchEmbassies: PropTypes.func.isRequired,
  handleFetchProvinces: PropTypes.func.isRequired,
  handleFetchDistricts: PropTypes.func.isRequired,
  handleFetchSectors: PropTypes.func.isRequired,
  handleFetchCells: PropTypes.func.isRequired,
  handleTransferRequestPending: PropTypes.func.isRequired,
  handleTransferRequestPendingClear: PropTypes.func.isRequired,
  transferReqPending: PropTypes.array.isRequired,
  roles: PropTypes.array,
  provinces: PropTypes.array,
  districts: PropTypes.array,
  sectors: PropTypes.array,
  healthFacilities: PropTypes.array,
  embassies: PropTypes.array,
  cells: PropTypes.array,
  workerHistoryList: PropTypes.array.isRequired,
  workerLogsCount: PropTypes.number.isRequired,
  workerLogsLoading: PropTypes.bool.isRequired,
  handleWorkerLogHistoryList: PropTypes.func.isRequired
};

UserActionModal.defaultProps = {
  userData: null,
  roles: [],
  provinces: [],
  districts: [],
  sectors: [],
  healthFacilities: [],
  embassies: [],
  cells: []
};

const roleReducer = 'roleReducer';
const healthFacilityReducer = 'healthFacilityReducer';
const embassyReducer = 'embassyReducer';
const provinceReducer = 'provinceReducer';
const districtReducer = 'districtReducer';
const sectorReducer = 'sectorReducer';
const cellReducer = 'cellReducer';
const userListReducer = 'userListReducer';
const transferRequestReducer = 'transferRequestReducer';
const mapStateToProps = state => ({
  roles: state.get(roleReducer) && state.get(roleReducer).roles ? state.get(roleReducer).roles : [],
  healthFacilities: state.get(healthFacilityReducer) && state.get(healthFacilityReducer).healthFacilities ? state.get(healthFacilityReducer).healthFacilities : [],
  embassies: state.get(embassyReducer) && state.get(embassyReducer).embassies ? state.get(embassyReducer).embassies : [],
  provinces: state.get(provinceReducer) && state.get(provinceReducer).provinces ? state.get(provinceReducer).provinces : [],
  districts: state.get(districtReducer) && state.get(districtReducer).districts ? state.get(districtReducer).districts : [],
  sectors: state.get(sectorReducer) && state.get(sectorReducer).sectors ? state.get(sectorReducer).sectors : [],
  cells: state.get(cellReducer) && state.get(cellReducer).cells ? state.get(cellReducer).cells : [],
  workerHistoryList: state.get(userListReducer) && state.get(userListReducer).workerHistoryList ? state.get(userListReducer).workerHistoryList : [],
  workerLogsCount: state.get(userListReducer) && state.get(userListReducer).workerLogsCount ? state.get(userListReducer).workerLogsCount : 0,
  transferReqPending: state.get(transferRequestReducer) && state.get(transferRequestReducer).transferReqPending ? state.get(transferRequestReducer).transferReqPending : '',
  transferReqPendingStatus: state.get(transferRequestReducer) && state.get(transferRequestReducer).transferReqPendingStatus ? state.get(transferRequestReducer).transferReqPendingStatus : '',
});

const mapDispatchToProps = dispatch => ({
  handleFetchRoles: bindActionCreators(fetchRoles, dispatch),
  handleFetchHealthFacilities: bindActionCreators(fetchHealthFacilities, dispatch),
  handleFetchEmbassies: bindActionCreators(fetchEmbassies, dispatch),
  handleFetchProvinces: bindActionCreators(fetchProvinces, dispatch),
  handleFetchDistricts: bindActionCreators(fetchDistricts, dispatch),
  handleFetchSectors: bindActionCreators(fetchSectors, dispatch),
  handleFetchCells: bindActionCreators(fetchCells, dispatch),
  handleTransferRequestPending: bindActionCreators(transferRequestPending, dispatch),
  handleWorkerLogHistoryList: bindActionCreators(workerLogHistoryList, dispatch),
  handleTransferRequestPendingClear: bindActionCreators(transferRequestPendingClear, dispatch)
});

const UserActionModalMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserActionModal);

export default UserActionModalMapped;
