import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Chip from '@material-ui/core/Chip';
import CheckIcon from '@material-ui/icons/Check';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import defaultUserImg from 'enl-images/user-default.jpg';
import { STATUS, ROLE } from './constants';
import * as URL from '../../../lib/apiUrls';
import {
  getNationality
} from '../../../utils/helpers';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 900,
      minWidth: 900
    }
  },
  titleRoot: {
    marginBottom: 10
  },
  label: {
    fontWeight: 'bold'
  },
  value: {
    marginLeft: 10
  },
  redLabel: {
    minWidth: 90,
    backgroundColor: '#ff6347',
  },
  greenLabel: {
    minWidth: 90,
    backgroundColor: '#228b22',
  },
  label_head: {
    fontWeight: 'bold',
    fontSize: '1.125rem',
    borderBottom: '1px dashed #C0C0C0'
  },
}));

const ViewModal = (props) => {
  const classes = useStyles();
  const {
    open, onClose, userData
  } = props;
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        className={classes.root}
      >
        <DialogTitle id="scroll-dialog-title" className={classes.titleRoot}>
          {userData && userData.users.surName}
          {' '}
          {userData && userData.users.postNames}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3} spacing={1} style={{ marginTop: '3rem' }}>
              <div style={{
                height: 170,
                marginLeft: 20,
                marginTop: 0,
                marginRight: 50,
                border: '1px dashed black'
              }}
              >
                <img
                  style={{ width: '100%', height: '100%' }}
                  src={`${URL.ASSET_URL}${userData && userData.users.photo}`}
                  alt=""
                  onError={(e) => { e.target.src = defaultUserImg; }}
                />
              </div>
            </Grid>
            <Grid container item xs={12} sm={9} spacing={1}>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <h6 className={classes.label_head}>
Users Details
                  </h6>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <h6 className={classes.label_head}>
Job Attributes
                  </h6>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Type of Document:</span>
                  <span className={classes.value}>{userData && userData.users.documentType}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Role:</span>
                  <span className={classes.value}>
                    {userData && userData.role ? ROLE[userData.role] : ''}
                  </span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Document Number:</span>
                  <span className={classes.value}>{userData && userData.users.documentNumber}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Ministry:</span>
                  <span className={classes.value}>{userData && userData.users.ministry}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Surname:</span>
                  <span className={classes.value}>{userData && userData.users.surName}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Facility Name:</span>
                  <span className={classes.value}>{userData && userData.users.facilityName}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Post-Names:</span>
                  <span className={classes.value}>{userData && userData.postNames}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Facility Type:</span>
                  <span className={classes.value}>{userData && userData.users.facilityType}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Date of Birth:</span>
                  <span className={classes.value}>{userData && userData.users.dateOfBirth}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Facility Area:</span>
                  <div>{userData && userData.displayCurrentFacilityArea}</div>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Sex:</span>
                  <span className={classes.value}>{userData && userData.users.sex}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Facility ID:</span>
                  <span className={classes.value}>{userData && userData.users.facilityId}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Email:</span>
                  <span className={classes.value}>{userData && userData.users.email}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Nationality:</span>
                  <span className={classes.value}>{userData && userData.users.nationality ? getNationality(userData.users.nationality) : ''}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Telephone Number:</span>
                  <span className={classes.value}>{userData && userData.users.phoneNumber}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12} style={{ marginTop: '0.625rem' }}>
                <Grid item xs={12} sm={6}>
                  <h6 className={classes.label_head}>
Applied Facilities
                  </h6>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <h6 className={classes.label_head}>
Current Facilities
                  </h6>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Applied Facility Name:</span>
                  <span className={classes.value}>{userData && userData.appliedFacilityBy}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Current Facility Name:</span>
                  <span className={classes.value}>{userData && userData.currentFacilityBy}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Applied Facility Type:</span>
                  <span className={classes.value}>{userData && userData.appliedFacilityType}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Current Facility Type:</span>
                  <span className={classes.value}>{userData && userData.currentFacilityType}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Applied Facility Area:</span>
                  <div>{userData && userData.displayAppliedFacilityName}</div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Current Facility Area:</span>
                  <div>{userData && userData.displayCurrentFacilityArea}</div>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Transfer Reason:</span>
                  <span className={classes.value}>{userData && userData.transferReason}</span>
                </Grid>
              </Grid>


              <Grid container item xs={12} sm={12} style={{ marginTop: '0.625rem' }}>
                <Grid item xs={12} sm={12}>
                  <h6 className={classes.label_head}>
Approved Details
                  </h6>
                </Grid>

                <Grid container item xs={12} sm={12}>
                  <Grid item xs={12} sm={6}>
                    <span className={classes.label}>Request Date-Time:</span>
                    <span className={classes.value} style={{ fontSize: '0.875rem' }}>
                      {moment(userData && userData.createdAt).format('DD/MM/YYYY hh:mm A')}
                    </span>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <span className={classes.label}>Action Date-Time:</span>
                    <span className={classes.value} style={{ fontSize: '0.875rem' }}>
                      {moment(userData && userData.approvedAt).format('DD/MM/YYYY hh:mm A')}
                    </span>
                  </Grid>
                </Grid>
                <Grid container item xs={12} sm={12}>
                  <Grid item xs={12} sm={6}>
                    <span className={classes.label}>Approved By:</span>
                    <span className={classes.value}>{userData && userData.approvedByName}</span>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <span className={classes.label}>Status</span>
                    <span className={classes.value}>
                      {
                        userData && userData.status === STATUS.APPROVED
                          ? (<Chip label="Approved" color="primary" size="small" icon={<CheckIcon />} className={classes.greenLabel} />)
                          : (<Chip label="Rejected" color="primary" size="small" icon={<CancelPresentationIcon />} className={classes.redLabel} />)
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ViewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired
};

export default ViewModal;
