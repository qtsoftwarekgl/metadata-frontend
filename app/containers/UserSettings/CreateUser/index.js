import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightBlue } from '@material-ui/core/colors';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Type from 'enl-styles/Typography.scss';
import { Card, CardContent } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import AsyncSelect from 'react-select/async';
import ReactSelect from 'react-select';
import _ from 'lodash';
import ErrorAlert from 'enl-components/Alerts/ErrorAlert';
import LoadingAlert from 'enl-components/Alerts/LoadingAlert';
import defaultUserImg from 'enl-images/user-default.jpg';
import moment from 'moment';
import SuccessAlert from './UserSuccessAlert';
import { createNewUser, createNewUserClear } from './userActions';
import styles from './create-user-jss';
import {
  MINISTRIES, REGEX, PHONE_LENGTH, DATE_FORMAT, VITAL_STATUS
} from '../../../lib/constants';
import API from '../../../config/axiosConfig';
import * as URL from '../../../lib/apiUrls';
import {
  docInputValildation, documentNumberValidation, getErrorMessage, getNationality
} from '../../../utils/helpers';
import brand from 'enl-api/dummy/brand';

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
  }
});

class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docType: 'NID',
      docNumber: '',
      document: null,
      showAlert: false,
      showErrorAlert: false,
      errorAlertMessage: '',
      rolesList: [],
      healthFacilityList: [],
      embassyList: [],
      provinceList: [],
      districtList: [],
      sectorList: [],
      cellList: [],
      districtLoading: false,
      sectorLoading: false,
      cellLoading: false,
      roles: null,
      role: null,
      ministry: '',
      healthFacility: null,
      embassy: null,
      position: '',
      institutionName: '',
      province: null,
      district: null,
      sector: null,
      cell: null,
      phoneNumber: '',
      email: '',
      tempCitizen: null,
      selectedCitizen: null,
      citizenPhotoUrl: '',
      docNumberError: '',
      showErrorBorder: false,
      roleError: '',
      ministryError: '',
      healthFacilityError: '',
      embassyError: '',
      positionError: '',
      institutionNameError: '',
      provinceError: '',
      districtError: '',
      sectorError: '',
      cellError: '',
      phoneNumberError: '',
      emailError: '',
      validationTriggered: false
    };
  }

  componentDidMount() {
    this.handleGetRoles();
    this.handleGetEmbassies();
    this.handleGetHealthFacilities();
    this.handleGetProvinces();
  }

  static getDerivedStateFromProps(nextProps) {
    const { userCreated, message, handleCreateNewUserClear } = nextProps;
    const updatedState = {};
    if (userCreated === 'ok') {
      updatedState.showAlert = true;
      updatedState.docNumber = '';
      updatedState.role = '';
      updatedState.roles = null;
      updatedState.ministry = '';
      updatedState.healthFacility = '';
      updatedState.embassy = '';
      updatedState.position = '';
      updatedState.institutionName = '';
      updatedState.province = '';
      updatedState.district = '';
      updatedState.sector = '';
      updatedState.cell = '';
      updatedState.phoneNumber = '';
      updatedState.email = '';
      updatedState.tempCitizen = null;
      updatedState.selectedCitizen = null;
      updatedState.citizenPhotoUrl = '';
      handleCreateNewUserClear();
    } else if (userCreated === 'error') {
      updatedState.showErrorAlert = true;
      if (message === 'server_error.document_id_already_exists') {
        updatedState.errorAlertMessage = 'Application / User already exist with this document number.';
      } else {
        updatedState.errorAlertMessage = getErrorMessage(message);
      }
      handleCreateNewUserClear();
    }
    return updatedState;
  }

  handleClose = () => {
    this.setState({
      showAlert: false
    });
    window.location.reload(false);
  }

  handleChange = name => event => {
    if (name === 'phoneNumber') {
      const { ministry, phoneNumber } = this.state;
      if (ministry !== 'MINAFFET' && REGEX.NUMBER.test(event.target.value)) {
        if (phoneNumber.length < PHONE_LENGTH) {
          this.setState({
            phoneNumber: event.target.value
          });
        } else {
          this.setState({
            phoneNumber: event.target.value.slice(0, PHONE_LENGTH)
          });
        }
      } else if (REGEX.PHONE_EMBASSY.test(event.target.value)) {
        this.setState({
          phoneNumber: event.target.value
        });
      }
    } else if (name === 'docType') {
      this.setState({
        docType: event.target.value,
        docNumber: '',
        document: null,
        role: null,
        ministry: '',
        healthFacility: null,
        embassy: null,
        position: '',
        institutionName: '',
        province: null,
        district: null,
        sector: null,
        cell: null,
        phoneNumber: '',
        email: '',
        tempCitizen: null,
        selectedCitizen: null,
        citizenPhotoUrl: '',
        docNumberError: '',
        showErrorBorder: false,
        roleError: '',
        ministryError: '',
        healthFacilityError: '',
        embassyError: '',
        positionError: '',
        institutionNameError: '',
        provinceError: '',
        districtError: '',
        sectorError: '',
        cellError: '',
        phoneNumberError: '',
        emailError: '',
        validationTriggered: false
      });
    } else {
      this.setState({
        [name]: event.target.value,
      });
    }
    const { validationTriggered } = this.state;
    if (validationTriggered) {
      setTimeout(() => {
        this.validateUserData();
      }, 30);
    }
  };

  handleGetCitizens = async (value) => {
    this.setState({
      docNumberError: '',
      docNumber: value
    });
    const { docType } = this.state;
    const valid = documentNumberValidation(docType, value);
    if (valid.isValid) {
      const docData = {
        documentType: docType,
        documentNumber: value
      };
      const res = await API.post(URL.GET_CITIZEN, docData)
        .then(async (response) => {
          const result = response.data;
          if (result.citizenStatus !== '13') {
            if (moment().diff(moment(result.dateOfBirth, 'DD-MM-YYYY'), 'years') > 18) {
              this.setState({
                tempCitizen: response.data
              });
              const data = [{
                value: result.documentNumber.replace(/\s/g, ''),
                label: `${result.surName} - ${result.documentNumber.replace(/\s/g, '')}`
              }];
              return data;
            }
            this.setState({
              showErrorAlert: true,
              errorAlertMessage: 'User minimum age must be 18 years.'
            });
            return [];
          }
          this.setState({
            showErrorAlert: true,
            errorAlertMessage: 'User should be alive.'
          });
          return [];
        })
        .catch(() => []);
      return res;
    }
    this.setState({
      docNumberError: valid.errorMsg
    });
    return [];
  }

  handleCitizenSelect = (selected, triggeredAction) => {
    const { tempCitizen } = this.state;
    if (triggeredAction.action === 'clear') {
      this.setState({
        docNumber: '',
        document: null,
        role: null,
        ministry: '',
        healthFacility: null,
        embassy: null,
        position: '',
        institutionName: '',
        province: null,
        district: null,
        sector: null,
        cell: null,
        districtList: [],
        sectorList: [],
        cellList: [],
        phoneNumber: '',
        email: '',
        selectedCitizen: '',
        citizenPhotoUrl: '',
        docNumberError: '',
        roleError: '',
        ministryError: '',
        healthFacilityError: '',
        embassyError: '',
        positionError: '',
        institutionNameError: '',
        provinceError: '',
        districtError: '',
        sectorError: '',
        cellError: '',
        phoneNumberError: '',
        emailError: ''
      });
    } else {
      this.setState({
        docNumber: selected.value,
        docNumberError: '',
        document: {
          value: tempCitizen.documentNumber.replace(/\s/g, ''),
          label: `${tempCitizen.surName} - ${tempCitizen.documentNumber.replace(/\s/g, '')}`
        },
        selectedCitizen: tempCitizen,
        showErrorBorder: false
      });
      this.setState({
        citizenPhotoUrl: tempCitizen.photo
      });
    }
  }

  handleGetRoles = () => {
    API.get(`${URL.ROLES_LIST}?fields=name,status,value,ministry,role`)
      .then(response => {
        if (response && response.status === 'ok') {
          const results = response.data;
          this.setState({
            roles: results,
            rolesList: results
          });
        }
      });
  }

  handleRoleSelect = (selected, triggeredAction) => {
    if (triggeredAction.action === 'clear') {
      this.setState({
        role: null,
        ministry: '',
        healthFacility: null,
        embassy: null,
        position: '',
        institutionName: '',
        province: null,
        district: null,
        sector: null,
        cell: null,
        districtList: [],
        sectorList: [],
        cellList: [],
        roleError: 'Please select role.',
        ministryError: '',
        healthFacilityError: '',
        embassyError: '',
        positionError: '',
        institutionNameError: '',
        provinceError: '',
        districtError: '',
        sectorError: '',
        cellError: '',
      });
    } else {
      const { roles } = this.state;
      const selectedRole = _.find(roles, { value: selected.value });
      this.setState({
        role: selected,
        ministry: selectedRole && selectedRole.ministry ? selectedRole.ministry : '',
        healthFacility: null,
        embassy: null,
        position: '',
        institutionName: '',
        province: null,
        district: null,
        sector: null,
        cell: null,
        districtList: [],
        sectorList: [],
        cellList: [],
        roleError: '',
        ministryError: '',
        healthFacilityError: '',
        embassyError: '',
        positionError: '',
        institutionNameError: '',
        provinceError: '',
        districtError: '',
        sectorError: '',
        cellError: '',
      });
    }
  }

  handleGetHealthFacilities = () => {
    API.get(`${URL.HEALTH_FACILITIES_LIST}?fields=name,status`)
      .then(response => {
        if (response && response.status === 'ok') {
          const results = response.data;
          this.setState({
            healthFacilityList: results
          });
        }
      });
  }

  handleHealthFacilitySelect = (selected, triggeredAction) => {
    if (triggeredAction.action === 'clear') {
      this.setState({
        healthFacility: null,
        healthFacilityError: ''
      });
    } else {
      this.setState({
        healthFacility: selected,
        healthFacilityError: ''
      });
    }
  }

  handleGetEmbassies = () => {
    API.get(`${URL.EMBASSIES_LIST}?feilds=name,cityName,status`)
      .then(response => {
        if (response && response.status === 'ok') {
          const results = response.data;
          this.setState({
            embassyList: results
          });
        }
      });
  }

  handleEmbassySelect = (selected, triggeredAction) => {
    if (triggeredAction.action === 'clear') {
      this.setState({
        embassy: null
      });
    } else {
      this.setState({
        embassy: selected
      });
    }
  }

  handleGetProvinces = () => {
    API.get(`${URL.PROVINCES_LIST}`)
      .then(response => {
        if (response && response.status === 'ok') {
          const results = response.data;
          this.setState({
            provinceList: results
          });
        }
      });
  }

  handleProvinceSelect = (selected, triggeredAction) => {
    if (triggeredAction.action === 'clear') {
      this.setState({
        province: null,
        district: null,
        sector: null,
        cell: null,
        districtList: [],
        sectorList: [],
        cellList: [],
        districtError: '',
        sectorError: '',
        cellError: '',
      });
    } else {
      this.setState({
        province: selected,
        district: null,
        sector: null,
        cell: null,
        districtList: [],
        sectorList: [],
        cellList: [],
        provinceError: '',
        districtError: '',
        sectorError: '',
        cellError: '',
      });
      this.handleGetDistricts(selected.value);
    }
  }

  handleGetDistricts = (proviceId) => {
    this.setState({
      districtLoading: true
    });
    API.get(`${URL.DISTRICTS_LIST}?fields=name,code,provinceId,status`, { params: { provinceId: proviceId } })
      .then(response => {
        if (response && response.status === 'ok') {
          const results = response.data;
          this.setState({
            districtList: results,
            districtLoading: false
          });
        } else {
          this.setState({
            districtLoading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          districtLoading: false
        });
      });
  }

  handleDistrictSelect = (selected, triggeredAction) => {
    if (triggeredAction.action === 'clear') {
      this.setState({
        district: null,
        sector: null,
        cell: null,
        sectorList: [],
        cellList: [],
        sectorError: '',
        cellError: ''
      });
    } else {
      this.setState({
        district: selected,
        sector: null,
        cell: null,
        sectorList: [],
        cellList: [],
        districtError: '',
        sectorError: '',
        cellError: ''
      });
      this.handleGetSectors(selected.value);
    }
  }

  handleGetSectors = (districtId) => {
    this.setState({
      sectorLoading: true
    });
    API.get(`${URL.SECTORS_LIST}?fields=name,code,districtId,status`, { params: { districtId } })
      .then(response => {
        if (response && response.status === 'ok') {
          const results = response.data;
          this.setState({
            sectorLoading: false,
            sectorList: results
          });
        } else {
          this.setState({
            sectorLoading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          sectorLoading: false
        });
      });
  }

  handleSectorSelect = (selected, triggeredAction) => {
    if (triggeredAction.action === 'clear') {
      this.setState({
        sector: null,
        cell: null,
        cellList: [],
        sectorError: '',
        cellError: ''
      });
    } else {
      this.setState({
        sector: selected,
        cell: null,
        cellList: [],
        sectorError: '',
        cellError: ''
      });
      this.handleGetCells(selected.value);
    }
  }

  handleGetCells = (sectorId) => {
    this.setState({
      cellLoading: true
    });
    API.get(`${URL.CELLS_LIST}?fields=name,code,sectorId,status`, { params: { sectorId } })
      .then(response => {
        if (response && response.status === 'ok') {
          const results = response.data;
          this.setState({
            cellLoading: false,
            cellList: results
          });
        } else {
          this.setState({
            cellLoading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          cellLoading: false
        });
      });
  }

  handleCellSelect = (selected, triggeredAction) => {
    if (triggeredAction.action === 'clear') {
      this.setState({
        cell: null,
        cellError: ''
      });
    } else {
      this.setState({
        cell: selected,
        cellError: ''
      });
    }
  }

  validateUserData = () => {
    let valid = true;
    this.setState({
      docNumberError: '',
      roleError: '',
      ministryError: '',
      healthFacilityError: '',
      embassyError: '',
      positionError: '',
      institutionNameError: '',
      provinceError: '',
      districtError: '',
      sectorError: '',
      cellError: '',
      phoneNumberError: '',
      emailError: ''
    });
    const {
      selectedCitizen,
      role,
      ministry,
      healthFacility,
      embassy,
      position,
      institutionName,
      province,
      district,
      sector,
      cell,
      phoneNumber,
      email
    } = this.state;
    if (!selectedCitizen) {
      valid = false;
      this.setState({
        docNumberError: 'Please enter document number and select citizen.',
        showErrorBorder: true
      });
    }
    if (!role) {
      valid = false;
      this.setState({
        roleError: 'Please select role.'
      });
    }
    const roleValue = role && role.value ? role.value : '';

    if ((roleValue === 'NOTIFIER_HF' || roleValue === 'CR_HF') && !healthFacility) {
      valid = false;
      this.setState({
        healthFacilityError: 'Please select health facility.'
      });
    }
    if ((roleValue === 'NOTIFIER_EMBASSY' || roleValue === 'CR_EMBASSY') && !embassy) {
      valid = false;
      this.setState({
        embassyError: 'Please select embassy.'
      });
    }
    if ((roleValue === 'NOTIFIER_DISTRICT' || roleValue === 'CR_DISTRICT'
    || roleValue === 'NOTIFIER_SECTOR' || roleValue === 'CR_SECTOR' || roleValue === 'CR_CELL')) {
      if (!province) {
        valid = false;
        this.setState({
          provinceError: 'Please select a province.'
        });
      }
      if (!district) {
        valid = false;
        this.setState({
          districtError: 'Please select a district.'
        });
      }
    }
    if (roleValue === 'NOTIFIER_SECTOR' || roleValue === 'CR_SECTOR' || roleValue === 'CR_CELL') {
      if (!sector) {
        valid = false;
        this.setState({
          sectorError: 'Please select sector.'
        });
      }
    }
    if (roleValue === 'CR_CELL' && !cell) {
      valid = false;
      this.setState({
        cellError: 'Please select cell.'
      });
    }
    if (roleValue === 'MINISTRY_ADMIN' && !ministry) {
      valid = false;
      this.setState({
        ministryError: 'Please select ministry.'
      });
    }
    if (roleValue === 'LAUNCHER') {
      if (!position) {
        valid = false;
        this.setState({
          positionError: 'Please select position.'
        });
      }
      if (!institutionName) {
        valid = false;
        this.setState({
          positionError: 'Please select Institution name.'
        });
      }
    }

    if (ministry !== 'MINAFFET' && !REGEX.PHONE.test(phoneNumber)) {
      valid = false;
      this.setState({
        phoneNumberError: 'Please enter valid phone number. eg: 072xxxxxxx, 073xxxxxxx, 078xxxxxxx or 079xxxxxxx'
      });
    } else if (!phoneNumber) {
      valid = false;
      this.setState({
        phoneNumberError: 'Please enter valid phone number. Numbers and ()+- only allowed.'
      });
    } else if (!REGEX.PHONE_EMBASSY.test(phoneNumber)) {
      valid = false;
      this.setState({
        phoneNumberError: 'Please enter valid phone number. Numbers and ()+- only allowed.'
      });
    }

    if (!REGEX.EMAIL.test(email)) {
      valid = false;
      this.setState({
        emailError: 'Please enter valid email.'
      });
    }
    return valid;
  }

  handleSubmit = () => {
    if (this.validateUserData()) {
      this.setState({
        validationTriggered: false
      });

      const {
        roles,
        docType,
        docNumber,
        role,
        ministry,
        healthFacility,
        embassy,
        position,
        institutionName,
        province,
        district,
        sector,
        cell,
        phoneNumber,
        email,
        citizenPhotoUrl,
        selectedCitizen,
        tempCitizen
      } = this.state;

      const {
        surName,
        postNames,
        dateOfBirth,
        dateOfExpiry,
        maritalStatus,
        sex,
        nationality,
        domicileCountry,
        domicileDistrict,
        domicileProvince,
        domicileSector,
        domicileCell,
        domicileVillage
      } = selectedCitizen;

      const userData = {
        documentType: docType,
        documentNumber: docNumber,
        surName: surName || '',
        postNames: postNames || '',
        dateOfBirth: dateOfBirth ? moment(dateOfBirth, DATE_FORMAT).format(DATE_FORMAT) : '',
        dateOfExpiry: dateOfExpiry ? moment(dateOfExpiry, DATE_FORMAT).format(DATE_FORMAT) : '',
        maritalStatus: maritalStatus || '',
        citizenStatus: tempCitizen.citizenStatus || '',
        sex: sex || '',
        nationality: nationality || '',
        domicileCountry: domicileCountry || '',
        domicileDistrict: domicileDistrict || '',
        domicileProvince: domicileProvince || '',
        domicileSector: domicileSector || '',
        domicileCell: domicileCell || '',
        domicileVillage: domicileVillage || '',
        photo: citizenPhotoUrl,
        phoneNumber: phoneNumber || '',
        email: email ? email.toLowerCase() : '',
        accessType: role ? role.value : '',
        residentialCountry: domicileCountry || '',
        issueNumber: tempCitizen && tempCitizen.issueNumber && tempCitizen.issueNumber,
        dateOfIssue: tempCitizen && tempCitizen.dateOfIssue && tempCitizen.dateOfIssue,
        placeOfIssue: tempCitizen && tempCitizen.placeOfIssue && tempCitizen.placeOfIssue,
        applicationNumber: tempCitizen && tempCitizen.applicationNumber && tempCitizen.applicationNumber,
        nin: tempCitizen && tempCitizen.nin && tempCitizen.nin,
        nid: tempCitizen && tempCitizen.nid && tempCitizen.nid,
        passportNumber: tempCitizen && tempCitizen.passportNumber && tempCitizen.passportNumber,
        refugeeNumber: tempCitizen && tempCitizen.refugeeNumber && tempCitizen.refugeeNumber,
        fatherName: tempCitizen && tempCitizen.fatherName && tempCitizen.fatherName,
        motherName: tempCitizen && tempCitizen.motherName && tempCitizen.motherName,
        birthCountry: tempCitizen && tempCitizen.birthCountry && tempCitizen.birthCountry,
        countryOfBirth: tempCitizen && tempCitizen.countryOfBirth && tempCitizen.countryOfBirth,
        villageId: tempCitizen && tempCitizen.villageId && tempCitizen.villageId,
        civilStatus: tempCitizen && tempCitizen.civilStatus && tempCitizen.civilStatus,
        spouse: tempCitizen && tempCitizen.spouse && tempCitizen.spouse,
        applicantType: tempCitizen && tempCitizen.applicantType && tempCitizen.applicantType,
      };

      const selectedRole = _.find(roles, { value: role.value });
      if (selectedRole) {
        userData.role = selectedRole.role;
        userData.facilityType = selectedRole.facilityType;
      }

      const roleValue = role && role.value ? role.value : '';

      if (roleValue !== 'SUPER_ADMIN' && roleValue !== 'VIEWER' && roleValue !== 'SECONDARY_ADMIN') {
        userData.ministry = ministry;
      }

      if (roleValue === 'LAUNCHER') {
        userData.position = position;
        userData.institutionName = institutionName;
      }

      if (roleValue === 'NOTIFIER_HF' || roleValue === 'CR_HF') {
        userData.facilityId = healthFacility.value;
      } else if (roleValue === 'NOTIFIER_EMBASSY' || roleValue === 'CR_EMBASSY') {
        userData.facilityId = embassy.value;
      } else if (roleValue === 'NOTIFIER_DISTRICT' || roleValue === 'CR_DISTRICT') {
        userData.facilityId = district.value;
        userData.residentialProvince = province.value;
        userData.residentialDistrict = district.value;
      } else if (roleValue === 'NOTIFIER_SECTOR' || roleValue === 'CR_SECTOR') {
        userData.facilityId = sector.value;
        userData.residentialProvince = province.value;
        userData.residentialDistrict = district.value;
        userData.residentialSector = sector.value;
      } else if (roleValue === 'CR_CELL') {
        userData.facilityId = cell.value;
        userData.residentialProvince = province.value;
        userData.residentialDistrict = district.value;
        userData.residentialSector = sector.value;
        userData.residentialCell = cell.value;
      }
      const { handleCreateNewUser } = this.props;
      if (roleValue === 'SUPER_ADMIN') {
        handleCreateNewUser(userData, 'SUPER_ADMIN');
      } else {
        handleCreateNewUser(userData, 'USERS');
      }
    } else {
      this.setState({
        validationTriggered: true
      });
    }
  };

  render() {
    const {
      classes,
      loading
    } = this.props;

    const {
      role,
      docType,
      document,
      showAlert,
      showErrorAlert,
      errorAlertMessage,
      ministry,
      healthFacility,
      embassy,
      province,
      district,
      sector,
      cell,
      selectedCitizen,
      phoneNumber,
      email,
      citizenPhotoUrl,
      docNumberError,
      showErrorBorder,
      roleError,
      ministryError,
      healthFacilityError,
      embassyError,
      positionError,
      institutionNameError,
      provinceError,
      districtError,
      sectorError,
      cellError,
      phoneNumberError,
      emailError,
      rolesList,
      healthFacilityList,
      embassyList,
      provinceList,
      districtList,
      sectorList,
      cellList,
      districtLoading,
      sectorLoading,
      cellLoading
    } = this.state;
    const title = brand.name;
    const description = brand.desc;

    const roleValue = role && role.value ? role.value : '';

    const rolesListFormatted = [];
    rolesList.forEach((item) => {
      rolesListFormatted.push({
        value: item.value,
        label: item.name
      });
    });

    const healthFacilityListFormatted = [];
    healthFacilityList.forEach((item) => {
      healthFacilityListFormatted.push({
        value: item._id,
        label: item.name
      });
    });

    const embassyListFormatted = [];
    embassyList.forEach((item) => {
      embassyListFormatted.push({
        value: item._id,
        label: `${item.name} (${item.cityName})`
      });
    });

    const provinceListFormatted = [];
    provinceList.forEach((item) => {
      provinceListFormatted.push({
        value: item._id,
        label: item.name
      });
    });

    const districtListFormatted = [];
    districtList.forEach((item) => {
      districtListFormatted.push({
        value: item._id,
        label: item.name
      });
    });

    const sectorListFormatted = [];
    sectorList.forEach((item) => {
      sectorListFormatted.push({
        value: item._id,
        label: item.name
      });
    });

    const cellListFormatted = [];
    cellList.forEach((item) => {
      cellListFormatted.push({
        value: item._id,
        label: item.name
      });
    });

    return (
      <React.Fragment>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <Card className={classes.root} elevation={2}>
          <CardContent>
            <Typography variant="h5" className={Type.textLeft} gutterBottom>
              <span>Create User</span>
            </Typography>
            <Divider />
            <form className={classes.container} noValidate autoComplete="off">
              <Grid container direction="row" spacing={3}>
                <Grid item xs={4}>
                  <FormControl className={classes.formControlSelect} fullWidth>
                    <InputLabel>
                      <span>Identification Document</span>
                      <span className={classes.required}>*</span>
                    </InputLabel>
                    <ThemeProvider theme={theme}>
                      <Select
                        value={docType}
                        onChange={this.handleChange('docType')}
                      >
                        <MenuItem value="NID">NID (National ID)</MenuItem>
                        <MenuItem value="NID_APPLICATION_NUMBER">NID Application Number</MenuItem>
                        <MenuItem value="NIN">NIN</MenuItem>
                      </Select>
                    </ThemeProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ paddingTop: 14 }}>
                    <InputLabel>
                      <span style={{ fontSize: 10 }}>Document Number</span>
                      <span className={classes.required}>*</span>
                    </InputLabel>
                    <FormControl className={classes.formControl} fullWidth>
                      <ThemeProvider theme={theme}>
                        <AsyncSelect
                          onBlur={() => this.setState({ docNumberError: '' })}
                          loadOptions={this.handleGetCitizens}
                          onKeyDown={(e) => docInputValildation(e, docType)}
                          value={document}
                          isClearable
                          onChange={(value, triggeredAction) => { this.handleCitizenSelect(value, triggeredAction); }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl error={docNumberError !== ''} style={{ paddingTop: 40 }}>
                    <FormHelperText>{docNumberError}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                className={showErrorBorder ? classNames(classes.defaultContainer, classes.borderDanger) : classes.defaultContainer}
              >
                <Grid
                  container
                  direction="row"
                  spacing={3}
                  xs={10}
                  sm={10}
                  style={{ padding: 20 }}
                >
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          value={selectedCitizen && selectedCitizen.surName ? selectedCitizen.surName : ''}
                          label="Surname"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          value={selectedCitizen && selectedCitizen.postNames ? selectedCitizen.postNames : ''}
                          label="Post-Names"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          value={selectedCitizen && selectedCitizen.dateOfBirth ? selectedCitizen.dateOfBirth : ''}
                          label="Date of Birth"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlSelectInner}>
                      <InputLabel>
                        <span>Marital Status</span>
                        <span className={classes.required}>*</span>
                      </InputLabel>
                      <ThemeProvider theme={theme}>
                        <Select
                          disabled
                          value={selectedCitizen && selectedCitizen.maritalStatus ? selectedCitizen.maritalStatus : ''}
                        >
                          <MenuItem value="SINGLE">Single</MenuItem>
                          <MenuItem value="MARRIED">Married</MenuItem>
                          <MenuItem value="WIDOWED">Widowed</MenuItem>
                          <MenuItem value="DIVORCED">Divorced</MenuItem>
                          <MenuItem value="UNKNOWN">Unknown</MenuItem>
                        </Select>
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlSelectInner}>
                      <InputLabel>
                        <span>Sex</span>
                        <span className={classes.required}>*</span>
                      </InputLabel>
                      <ThemeProvider theme={theme}>
                        <Select
                          disabled
                          value={selectedCitizen && selectedCitizen.sex ? selectedCitizen.sex : ''}
                        >
                          <MenuItem value="MALE">Male</MenuItem>
                          <MenuItem value="FEMALE">Female</MenuItem>
                        </Select>
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classNames(classes.formControlInput, classes.formInputPadding)}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          label="Nationality"
                          value={selectedCitizen && selectedCitizen.nationality ? getNationality(selectedCitizen.nationality) : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          label="Document Number"
                          value={selectedCitizen && selectedCitizen.documentNumber ? selectedCitizen.documentNumber : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          label="Domicile Country"
                          value={selectedCitizen && selectedCitizen.domicileCountry ? selectedCitizen.domicileCountry : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          label="Domicile Province"
                          value={selectedCitizen && selectedCitizen.domicileProvince ? selectedCitizen.domicileProvince : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          label="Domicile District"
                          value={selectedCitizen && selectedCitizen.domicileDistrict ? selectedCitizen.domicileDistrict : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          label="Domicile Sector"
                          value={selectedCitizen && selectedCitizen.domicileSector ? selectedCitizen.domicileSector : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          label="Domicile Cell"
                          value={selectedCitizen && selectedCitizen.domicileCell ? selectedCitizen.domicileCell : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          label="Domicile Village"
                          value={selectedCitizen && selectedCitizen.domicileVillage ? selectedCitizen.domicileVillage : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth className={classes.formControlInput}>
                      <ThemeProvider theme={theme}>
                        <TextField
                          disabled
                          required
                          label="Vital Status"
                          value={selectedCitizen && selectedCitizen.citizenStatus ? (VITAL_STATUS[selectedCitizen.citizenStatus] ? VITAL_STATUS[selectedCitizen.citizenStatus] : selectedCitizen.citizenStatus) : ''}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </ThemeProvider>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container item xs={12} sm={2} spacing={3}>
                  <div
                    style={{
                      height: 170,
                      width: 170,
                      marginLeft: 40,
                      marginTop: 40,
                      border: '1px dashed black'
                    }}
                  >
                    {citizenPhotoUrl ? (
                      <img
                        style={{ width: '100%', height: '100%' }}
                        src={`${URL.ASSET_URL}${citizenPhotoUrl}`}
                        alt={selectedCitizen && selectedCitizen.surName}
                        onError={(e) => { e.target.src = defaultUserImg; }}
                      />
                    )
                      : (
                        <img
                          style={{ width: '100%', height: '100%' }}
                          src={defaultUserImg}
                          alt={selectedCitizen && selectedCitizen.surName}
                        />
                      )
                    }
                  </div>
                </Grid>
              </Grid>
              <Grid container direction="row" spacing={3}>
                <Grid item xs={3}>
                  <div className={classes.autoCompleteContainer}>
                    <InputLabel>
                      <span className={classes.autoCompleteLabel}>Role</span>
                      <span className={classes.required}>*</span>
                    </InputLabel>
                    <FormControl fullWidth className={classes.formControlSelect} error={roleError !== ''}>
                      <ThemeProvider theme={theme}>
                        <ReactSelect
                          menuPosition="fixed"
                          isClearable
                          value={role}
                          name="role"
                          options={rolesListFormatted}
                          onChange={(value, triggeredAction) => this.handleRoleSelect(value, triggeredAction)}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </ThemeProvider>
                      <FormHelperText>{roleError}</FormHelperText>
                    </FormControl>
                  </div>
                </Grid>
                {roleValue !== 'SUPER_ADMIN' && roleValue !== 'VIEWER' && roleValue !== 'SECONDARY_ADMIN'
                  ? (
                    <Grid item xs={3}>
                      <FormControl fullWidth className={classes.formControlSelect} error={ministryError !== ''}>
                        <InputLabel>
                          <span>Ministry</span>
                          <span className={classes.required}>*</span>
                        </InputLabel>
                        <ThemeProvider theme={theme}>
                          <Select
                            value={ministry}
                            onChange={this.handleChange('ministry')}
                            inputProps={{ readOnly: roleValue !== 'MINISTRY_ADMIN' }}
                          >
                            {
                              MINISTRIES.map(item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)
                            }
                          </Select>
                        </ThemeProvider>
                        <FormHelperText>{ministryError}</FormHelperText>
                      </FormControl>
                    </Grid>
                  ) : null}
                {roleValue === 'NOTIFIER_HF' || roleValue === 'CR_HF'
                  ? (
                    <Grid item xs={3}>
                      <div className={classes.autoCompleteContainer}>
                        <InputLabel>
                          <span className={classes.autoCompleteLabel}>Health Facility List</span>
                          <span className={classes.required}>*</span>
                        </InputLabel>
                        <FormControl fullWidth className={classes.formControlSelect} error={healthFacilityError !== ''}>
                          <ThemeProvider theme={theme}>
                            <ReactSelect
                              menuPosition="fixed"
                              isClearable
                              value={healthFacility}
                              name="healthFacility"
                              options={healthFacilityListFormatted}
                              onChange={(value, triggeredAction) => this.handleHealthFacilitySelect(value, triggeredAction)}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                          </ThemeProvider>
                          <FormHelperText>{healthFacilityError}</FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                  ) : null}
                {roleValue === 'NOTIFIER_EMBASSY' || roleValue === 'CR_EMBASSY'
                  ? (
                    <Grid item xs={3}>
                      <div className={classes.autoCompleteContainer}>
                        <InputLabel>
                          <span className={classes.autoCompleteLabel}>Embassy</span>
                          <span className={classes.required}>*</span>
                        </InputLabel>
                        <FormControl fullWidth className={classes.formControlSelect} error={embassyError !== ''}>
                          <ThemeProvider theme={theme}>
                            <ReactSelect
                              menuPosition="fixed"
                              isClearable
                              value={embassy}
                              name="embassy"
                              options={embassyListFormatted}
                              onChange={(value, triggeredAction) => this.handleEmbassySelect(value, triggeredAction)}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                          </ThemeProvider>
                          <FormHelperText>{embassyError}</FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                  ) : null}
                {roleValue === 'LAUNCHER'
                  ? (
                    <Grid item xs={12} sm={3}>
                      <FormControl
                        fullWidth
                        className={classNames(classes.formControlInput, classes.formInputPadding)}
                        error={positionError !== ''}
                      >
                        <ThemeProvider theme={theme}>
                          <TextField
                            required
                            className={classes.margin}
                            label="Position"
                            onChange={this.handleChange('position')}
                          />
                        </ThemeProvider>
                        <FormHelperText>{positionError}</FormHelperText>
                      </FormControl>
                    </Grid>
                  )
                  : null}
                {roleValue === 'LAUNCHER'
                  ? (
                    <Grid item xs={12} sm={3}>
                      <FormControl
                        fullWidth
                        className={classNames(classes.formControlInput, classes.formInputPadding)}
                        error={institutionNameError !== ''}
                      >
                        <ThemeProvider theme={theme}>
                          <TextField
                            required
                            className={classes.margin}
                            label="Institution Name"
                            onChange={this.handleChange('institutionName')}
                          />
                        </ThemeProvider>
                        <FormHelperText>{institutionNameError}</FormHelperText>
                      </FormControl>
                    </Grid>
                  )
                  : null}
              </Grid>
              <Grid container direction="row" spacing={3}>
                {roleValue === 'NOTIFIER_DISTRICT' || roleValue === 'NOTIFIER_SECTOR'
                  || roleValue === 'CR_DISTRICT' || roleValue === 'CR_SECTOR' || roleValue === 'CR_CELL'
                  ? (
                    <Grid item xs={3}>
                      <div className={classes.autoCompleteContainer}>
                        <InputLabel>
                          <span className={classes.autoCompleteLabel}>Facility Province</span>
                          <span className={classes.required}>*</span>
                        </InputLabel>
                        <FormControl fullWidth className={classes.formControlSelect} error={provinceError !== ''}>
                          <ThemeProvider theme={theme}>
                            <ReactSelect
                              menuPosition="fixed"
                              isClearable
                              value={province}
                              name="province"
                              options={provinceListFormatted}
                              onChange={(value, triggeredAction) => this.handleProvinceSelect(value, triggeredAction)}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                          </ThemeProvider>
                          <FormHelperText>{provinceError}</FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                  ) : null}
                {roleValue === 'NOTIFIER_DISTRICT' || roleValue === 'NOTIFIER_SECTOR'
                  || roleValue === 'CR_DISTRICT' || roleValue === 'CR_SECTOR' || roleValue === 'CR_CELL'
                  ? (
                    <Grid item xs={3}>
                      <div className={classes.autoCompleteContainer}>
                        <InputLabel>
                          <span className={classes.autoCompleteLabel}>Facility District</span>
                          <span className={classes.required}>*</span>
                        </InputLabel>
                        <FormControl fullWidth className={classes.formControlSelect} error={districtError !== ''}>
                          <ThemeProvider theme={theme}>
                            <ReactSelect
                              menuPosition="fixed"
                              isClearable
                              isLoading={districtLoading}
                              value={district}
                              name="district"
                              options={districtListFormatted}
                              onChange={(value, triggeredAction) => this.handleDistrictSelect(value, triggeredAction)}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                          </ThemeProvider>
                          <FormHelperText>{districtError}</FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                  ) : null}
                {roleValue === 'NOTIFIER_SECTOR' || roleValue === 'CR_SECTOR' || roleValue === 'CR_CELL'
                  ? (
                    <Grid item xs={3}>
                      <div className={classes.autoCompleteContainer}>
                        <InputLabel>
                          <span className={classes.autoCompleteLabel}>Facility Sector</span>
                          <span className={classes.required}>*</span>
                        </InputLabel>
                        <FormControl fullWidth className={classes.formControlSelect} error={sectorError !== ''}>
                          <ThemeProvider theme={theme}>
                            <ReactSelect
                              menuPosition="fixed"
                              isClearable
                              isLoading={sectorLoading}
                              value={sector}
                              name="sector"
                              options={sectorListFormatted}
                              onChange={(value, triggeredAction) => this.handleSectorSelect(value, triggeredAction)}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                          </ThemeProvider>
                          <FormHelperText>{sectorError}</FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                  ) : null}
                {roleValue === 'CR_CELL'
                  ? (
                    <Grid item xs={3}>
                      <div className={classes.autoCompleteContainer}>
                        <InputLabel>
                          <span className={classes.autoCompleteLabel}>Facility Cell</span>
                          <span className={classes.required}>*</span>
                        </InputLabel>
                        <FormControl fullWidth className={classes.formControlSelect} error={cellError !== ''}>
                          <ThemeProvider theme={theme}>
                            <ReactSelect
                              menuPosition="fixed"
                              isClearable
                              isLoading={cellLoading}
                              value={cell}
                              name="cell"
                              options={cellListFormatted}
                              onChange={(value, triggeredAction) => this.handleCellSelect(value, triggeredAction)}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                          </ThemeProvider>
                          <FormHelperText>{cellError}</FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                  ) : null}
              </Grid>
              <Grid container direction="row" spacing={1}>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    className={classes.formControlInput}
                    error={phoneNumberError !== ''}
                  >
                    <ThemeProvider theme={theme}>
                      <TextField
                        required
                        className={classes.margin}
                        label="Telephone Number"
                        value={phoneNumber}
                        onChange={this.handleChange('phoneNumber')}
                      />
                    </ThemeProvider>
                    <FormHelperText>{phoneNumberError}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth className={classes.formControlInput} error={emailError !== ''}>
                    <ThemeProvider theme={theme}>
                      <TextField
                        required
                        className={classes.margin}
                        label="Email"
                        value={email}
                        onChange={this.handleChange('email')}
                      />
                    </ThemeProvider>
                    <FormHelperText>{emailError}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
            <div className={classes.btnHolder}>
              <Button
                variant="outlined"
                color="secondary"
                href="/user-settings/user-list"
                className={classes.button}
              >
                Back to Users
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
                className={classes.button}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
        <SuccessAlert
          message="New user created successfully."
          open={showAlert}
          onClose={this.handleClose}
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
          open={loading}
        />
      </React.Fragment>
    );
  }
}

CreateUser.propTypes = {
  classes: PropTypes.object.isRequired,
  handleCreateNewUser: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

CreateUser.defaultProps = {
  loading: false
};

const userReducer = 'userReducer';
const mapStateToProps = state => ({
  loading: state.get(userReducer) && state.get(userReducer).loading ? state.get(userReducer).loading : false,
  userCreated: state.get(userReducer) && state.get(userReducer).userCreated ? state.get(userReducer).userCreated : '',
  message: state.get(userReducer) && state.get(userReducer).message ? state.get(userReducer).message : '',
});

const mapDispatchToProps = dispatch => ({
  handleCreateNewUser: bindActionCreators(createNewUser, dispatch),
  handleCreateNewUserClear: bindActionCreators(createNewUserClear, dispatch),
});

const CreateUserMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUser);

export default withStyles(styles)(CreateUserMapped);
