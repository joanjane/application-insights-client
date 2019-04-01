import './Settings.css';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { clearDataAction } from 'Actions/Profile';
import { setAutoRefreshAction, setSearchPeriodAction } from 'Actions/Logs';
import AuthenticationType from 'Models/AuthenticationType';
import UISettings from './UISettings';
import AadResourcePicker from './AadResourcePicker';
import AuthenticationModeSelector from './AuthenticationModeSelector';
import ApiKeyCredentials from './ApiKeyCredentials';

const mapStateToProps = state => {
  return {
    autoRefresh: state.autoRefresh,
    searchPeriod: state.searchPeriod,
    authenticationType: state.credentials.authenticationType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearData: () => dispatch(clearDataAction()),
    setAutoRefresh: enabled => dispatch(setAutoRefreshAction(enabled)),
    setSearchPeriod: searchPeriod => dispatch(setSearchPeriodAction(searchPeriod)),
  };
};

class Settings extends Component {

  handlePeriodChange(event) {
    this.props.setSearchPeriod(event.target.value);
  }

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

  renderPeriod() {
    return (
      <div className="ail-credentials-section">
        <label>Search period</label>
        <input className="ail-input" value={this.props.searchPeriod}
          placeholder='Specify period (P7D, PT1H...)'
          id="searchPeriod"
          onChange={(e) => this.handlePeriodChange(e)} />
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
        {this.renderPeriod()}
        <UISettings />
      </div>
    );
  }
}
Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);
export default Settings;