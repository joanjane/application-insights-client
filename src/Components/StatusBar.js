import React from 'react';
import { connect } from 'react-redux';
import DateUtils from 'Utils/DateUtils';
import './StatusBar.css';
import { resolveDepenency } from 'Store/container';
const aadAuthService = resolveDepenency('AadAuthService');

const mapStateToProps = state => {
  return {
    autoRefresh: state.autoRefresh,
    fetchTime: state.fetchTime,
    appName: state.appName,
    error: state.error,
    loading: state.loading
  };
};

let StatusBar = (props) => (
  <div className="ail-footer-status">
    <div className="ail-footer-status-item ail-footer-status--timestamp">
      {
        !props.loading ? (
          <div>
            updated at {DateUtils.formatDateTime(props.fetchTime)} {props.autoRefresh ? '(auto)' : ''}
          </div>
        ) : 'Loading...'
      }
    </div>
    {
      aadAuthService.isAuthenticated() ?
      <div style={{cursor: 'pointer', padding: '.5rem'}} className="ali-footer-login" onClick={() => aadAuthService.logout()}>Click here to logout</div> :
      <div style={{cursor: 'pointer', padding: '.5rem'}} className="ali-footer-login" onClick={() => aadAuthService.redirectToSso()}>Click here to login</div>
    }
    {props.error ?
      <div className="ail-footer-status-item ail-footer-status--error">
        {props.error}
      </div> : ''
    }
  </div>
);
StatusBar = connect(mapStateToProps)(StatusBar);
export default StatusBar;