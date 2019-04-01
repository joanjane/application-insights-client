import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearDataAction } from 'Actions/Profile';
import { setAutoRefreshAction } from 'Actions/Logs';

const mapStateToProps = state => {
  return {
    autoRefresh: state.autoRefresh,
    authenticationType: state.credentials.authenticationType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearData: () => dispatch(clearDataAction()),
    setAutoRefresh: enabled => dispatch(setAutoRefreshAction(enabled)),
  };
};

class GlobalSettings extends Component {

  clearData = () => {
    if (!window.confirm('Are you sure to clear all stored data?')) {
      return;
    }
    this.props.clearData();
  }

  toggleAutoRefresh() {
    this.props.setAutoRefresh(!this.props.autoRefresh);
  }

  render() {
    return (
      <div className="ail-credentials-section">
        <label>Settings</label>
        <ul className="ail-btn-list">
          <li className="ail-toggle">
            <input className="hidden" type="checkbox" id="autorefresh" checked={this.props.autoRefresh} onChange={() => this.toggleAutoRefresh()} />
            <label htmlFor="autorefresh" className="ail-btn">Auto refresh</label>
          </li>
          <li className="ail-btn ail-btn--default" onClick={() => this.clearData()}>Clear data</li>
        </ul>
      </div>
    );
  }
}

GlobalSettings = connect(mapStateToProps, mapDispatchToProps)(GlobalSettings);
export default GlobalSettings;