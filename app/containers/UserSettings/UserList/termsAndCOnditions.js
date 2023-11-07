
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Type from 'enl-styles/Typography.scss';
import DialogActions from '@material-ui/core/DialogActions';
import { Grid } from '@material-ui/core';

const IconDiamond = {
  width: 0,
  height: 0,
  border: '3px solid black',
  borderRadius: 50,
  marginRight: 4,
  backgroundColor: 'black',
  marginTop: 12
};
class TermsAndConditions extends React.Component {
  exportPDFWithMethod = () => {
    // eslint-disable-next-line react/no-find-dom-node
    savePDF(ReactDOM.findDOMNode(this.container), {
      paperSize: 'auto',
      margin: 40,
      width: '100%',
      fileName: 'CRVS Terms and conditions'
    });
  };

  render() {
    const { userData } = this.props;
    return (
      <div>
        <div>
          <PDFExport
            ref={component => { this.pdfExportComponent = component; }}
            paperSize="auto"
            margin={40}
            fileName={`Report for ${new Date().getFullYear()}`}
            author="KendoReact Team"
          >
            <div style={{ border: '1px solid', borderColor: '#000000', padding: 15 }} ref={container => { this.container = container; }}>
              <Typography variant="h3" className={Type.textCenter} gutterBottom style={{ paddingBottom: 11 }}>
                <span style={{
                  textTransform: 'uppercase', fontFamily: 'auto', fontSize: 26, fontWeight: 'bold'
                }}
                >
Terms and Conditions for CRVS System use
                </span>
              </Typography>
              <div className="row" style={{ textAlign: 'justify' }}>
                <Grid container spacing={1}>
                  <Grid item xs={10} sm={6} style={{ padding: 10 }}>
                    <div>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>
I
                        <u style={{ paddingLeft: 5 }}>
                          {String(userData.surName || '') + ' ' + String(userData.postNames || '')}
                          {' '}
                        </u>
                        <span style={{ paddingLeft: 5 }}>understand that I shall ensure that the collected data are reasonably complete, accurate and up to date, and are not subject to inappropriate alteration.</span>
                      </p>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>I understand that I shall establish appropriate administrative, technical, and physical safeguards to protect the confidentiality of the personal data and I shall not use the accessed personal data contrary to its intended purposes. </p>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>I shall establish necessary safeguards that provide high level of security that is not less than the level of guidelines governing privacy and confidentiality. </p>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>I shall comply with laws and guidelines governing data privacy, confidentiality and disclosure restrictions. More precisely, I shall ensure that the accessed data;</p>
                      <ul>
                        <li style={{ display: 'flex', marginLeft: 30 }}>
                          <span style={IconDiamond} />
                          <p style={{ fontFamily: 'auto', fontSize: 18 }}>Are used only for intended purposes;</p>
                        </li>
                        <li style={{ display: 'flex', marginLeft: 30 }}>
                          <span style={IconDiamond} />
                          <p style={{ fontFamily: 'auto', fontSize: 18 }}>Are prevented from abuse and disclosure by an unauthorized person;</p>
                        </li>
                        <li style={{ display: 'flex', marginLeft: 30 }}>
                          <span style={IconDiamond} />
                          <p style={{ fontFamily: 'auto', fontSize: 18 }}>Are not disseminated or published in any way that might reveal private information relating to identifiable individuals;</p>
                        </li>
                        <li style={{ display: 'flex', marginLeft: 30 }}>
                          <span style={IconDiamond} />
                          <p style={{ fontFamily: 'auto', fontSize: 18 }}>Are not prematurely released before their pre-announced publication date.</p>
                        </li>
                      </ul>
                    </div>
                  </Grid>
                  <Grid item xs={10} sm={6} style={{ padding: 10 }}>
                    <div>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>I shall maintain the higher level of security that is commensurate with the risk and magnitude of the harm that could result from the misuse or disclosure of the accessed data.</p>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>I commit that I shall observe and carefully implement the above stated data protection principles.</p>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>
Applicant name & Signature:
                        <strong><u>{String(userData.surName || '') + ' ' + String(userData.postNames || '')}</u></strong>
                        {' '}

                      </p>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>
Application Date:
                        <strong>{moment(userData.createdAt, 'YYYY-MM-DDTHH:mm:ss[Z]').format('ddd MMMM D YYYY')}</strong>
                      </p>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>
Approved by:
                        <strong>{String(userData.approvedBy && userData.approvedBy.surName ? userData.approvedBy.surName : '') + ' ' + String(userData.approvedBy && userData.approvedBy.postNames ? userData.approvedBy.postNames : '')}</strong>
                      </p>
                      <p style={{ fontFamily: 'auto', fontSize: 18 }}>
Approval Date:
                        <strong>{moment(userData.approvedAt, 'YYYY-MM-DDTHH:mm:ss[Z]').format('ddd MMMM D YYYY')}</strong>
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </PDFExport>
        </div>
        <div>
          <div style={{ width: '100%' }}>
            <div style={{
              position: 'absolute', width: '96%', bottom: 8, backgroundColor: '#ffffff'
            }}
            >
              <DialogActions style={{ padding: 0 }}>
                <Button color="primary" onClick={this.exportPDFWithMethod} variant="contained">
                  Download
                </Button>
              </DialogActions>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TermsAndConditions.propTypes = {
  userData: PropTypes.object.isRequired,
};
export default TermsAndConditions;
