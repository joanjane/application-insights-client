import React from 'react';
import { connect } from 'react-redux';
import './StatusBar.css';
import { inject } from 'Store/container';
import { anyCredentials } from 'Epics/credentialsUtils';
const dateUtils = inject('DateUtils');

const mapStateToProps = state => {
  return {
    autoRefresh: state.autoRefresh,
    fetchTime: state.fetchTime,
    appName: state.appName,
    error: state.error,
    loading: state.loading,
    connected: anyCredentials(state.credentials)
  };
};

let StatusBar = (props) => (
  <div className="ail-footer-status">
    {
      props.connected ?
        <div className="ail-footer-status-item ail-footer-status--timestamp">
          {
            !props.loading ? (
              <div>
                updated at {dateUtils.formatDateTime(props.fetchTime)} {props.autoRefresh ? '(auto)' : ''}
              </div>
            ) : 'Loading...'
          }
        </div>
        :
        <div className="ail-footer-status-item ail-footer-status--error">
          You must setup an authentication and an application on the right panel to start
        </div>
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