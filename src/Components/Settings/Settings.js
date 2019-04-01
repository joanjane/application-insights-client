import './Settings.css';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { clearDataAction } from 'Actions/Profile';
import { setAutoRefreshAction } from 'Actions/Logs';
import AuthenticationType from 'Models/AuthenticationType';
import UISettings from './UISettings';
import AadResourcePicker from './AadResourcePicker';
import AuthenticationModeSelector from './AuthenticationModeSelector';
import ApiKeyCredentials from './ApiKeyCredentials';
import SearchPeriodSetting from './SearchPeriodSetting';

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

class Settings extends Component {

  clearData = () => {
    if (!window.confirm('Are you sure to clear all stored data?')) {
      return;
    }
    this.props.clearData();
  }

  toggleAutoRefresh() {
    this.props.setAutoRefresh(!this.props.autoRefresh);
  }

  renderGlobalOptions() {
    return (
      <div className="ail-credentials-section">
        <label>Settings</label>
        <ul className="ail-btn-list">
          <li className="ail-toggle">
            <input className="hidden" type="checkbox" id="autorefresh" checked={this.props.autoRefresh} onChange={(e) => this.toggleAutoRefresh()} />
            <label htmlFor="autorefresh" className="ail-btn">Auto refresh</label>
          </li>
          <li className="ail-btn ail-btn--default" onClick={() => this.clearData()}>Clear data</li>
        </ul>
      </div>
    );
  }

  renderApplicationPicker() {
    return (
      <Fragment>
        {this.props.authenticationType === AuthenticationType.apiKey ? <ApiKeyCredentials /> : ''}
        {this.props.authenticationType === AuthenticationType.aad ? <AadResourcePicker /> : ''}
      </Fragment>
    );
  }

  render() {
    return (
      <div>
        <AuthenticationModeSelector />
        {this.renderApplicationPicker()}
        {this.renderGlobalOptions()}
        <SearchPeriodSetting />
        <UISettings />
      </div>
    );
  }
}
Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);
export default Settings;