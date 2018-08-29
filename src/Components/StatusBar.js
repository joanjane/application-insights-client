import React from 'react';
import { connect } from 'react-redux';
import DateUtils from '../Utils/DateUtils';
import './StatusBar.css';

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
    {props.error ?
      <div className="ail-footer-status-item ail-footer-status--error">
        {props.error}
      </div> : ''
    }
  </div>
);
StatusBar = connect(mapStateToProps)(StatusBar);
export default StatusBar;