import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import moment from 'moment';
import defaultUserImg from 'enl-images/user-default.jpg';
import { ROLE } from './constants';
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
  activeChip: {
    minWidth: 90,
    backgroundColor: '#2e8e0f'
  },
  inactiveChip: {
    minWidth: 90,
    backgroundColor: '#8c8989'
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
          {userData && userData.file_name}          
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {/* <Grid item xs={12} sm={3} spacing={1} style={{ margin: 'auto 0' }}>
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
            </Grid> */}
            <Grid container item xs={12} sm={9} spacing={1}>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <h6 className={classes.label_head}>
Dump Details
                  </h6>
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <h6 className={classes.label_head}>
Job Attributes
                  </h6>
                </Grid> */}
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Created Date:</span>
                  <span className={classes.value}>{moment(userData && userData.createdAt).format('DD/MM/YYYY hh:mm A')}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Updated Date:</span>
                  <span className={classes.value}>{moment(userData && userData.updatedAt).format('DD/MM/YYYY hh:mm A')}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={12}>
                  <span className={classes.label}>File Name:</span>
                  <span className={classes.value}>{userData && userData.file_name}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Version:</span>
                  <span className={classes.value}>{userData && userData.version}</span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Release Note:</span>
                  <span className={classes.value}>{userData && userData.release_note}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Status:</span>
                  <span className={classes.value}>{userData && userData.status==1 ? "ACTIVE" : "INACTIVE"}</span>
                </Grid>
              </Grid>
              {/* <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Post-Names:</span>
                  <span className={classes.value}>{userData && userData.users.postNames}</span>
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
                  <div>{userData && userData.users.displayFacilityArea}</div>
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
                  <span className={classes.value}>{userData && userData.email}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Action Date-Time:</span>
                  <span className={classes.value}>
                    {moment(userData && userData.createdAt).format('DD/MM/YYYY hh:mm A')}
                  </span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Nationality:</span>
                  <span className={classes.value}>{userData && userData.users.nationality ? getNationality(userData.users.nationality) : ''}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Status</span>
                  <span className={classes.value}>
                    {
                      userData && userData.status === 'ACTIVE'
                        ? (<Chip label="Active" color="primary" size="small" icon={<CheckIcon />} className={classes.activeChip} />)
                        : (<Chip label="Inactive" color="primary" size="small" icon={<ClearIcon />} className={classes.inactiveChip} />)
                    }
                  </span>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Telephone Number:</span>
                  <span className={classes.value}>{userData && userData.phoneNumber}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className={classes.label}>Actions Done By:</span>
                  <span className={classes.value}>{userData && userData.doneByName}</span>
                </Grid>
              </Grid> */}
              <Grid container item xs={12} sm={12} />
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
