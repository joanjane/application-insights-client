import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  setCredentialsAction,
  clearDataAction,
  tryFindApiCredentialsAction
} from 'Actions/Profile';
import { setAutoRefreshAction, setSearchPeriodAction } from 'Actions/Logs';
import AuthenticationType from 'Models/AuthenticationType';
import './Credentials.css';
import UISettings from './UISettings';
import AadResourcePicker from './AadResourcePicker';
import AuthenticationModeSelector from './AuthenticationModeSelector';

const mapStateToProps = state => {
  return {
    autoRefresh: state.autoRefresh,
    searchPeriod: state.searchPeriod,
    availableApps: [...state.availableApps],
    credentials: { ...state.credentials }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCredentials: credentials => dispatch(setCredentialsAction(credentials)),
    clearData: () => dispatch(clearDataAction()),
    tryFindCredentials: appName => dispatch(tryFindApiCredentialsAction(appName)),
    setAutoRefresh: enabled => dispatch(setAutoRefreshAction(enabled)),
    setSearchPeriod: searchPeriod => dispatch(setSearchPeriodAction(searchPeriod)),
  };
};

class Credentials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: { ...props.credentials },
      availableApps: props.availableApps,
      selectedStoredCredential: '',
      editing: props.credentials.api.appId === null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.editing && this.credentialsChanged(nextProps.credentials, this.state.credentials)) {
      this.setState({
        credentials: nextProps.credentials,
        selectedStoredCredential: ''
      });
    }
  }

  handleChange = (event) => {
    let { api } = this.state.credentials;
    api = { ...api, [event.target.id]: event.target.value };
    this.setState({ credentials: { ...this.state.credentials, api } });
  }

  handlePeriodChange(event) {
    this.props.setSearchPeriod(event.target.value);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.editing) {
      this.setState({ editing: !this.state.editing });
      return;
    }
    this.props.setCredentials({
      authenticationType: AuthenticationType.apiKey,
      api: this.state.credentials
    });
    this.setState({ editing: !this.state.editing });
  }

  checkStoredAppCredentials(appName) {
    this.setState({ editing: false });
    this.props.tryFindCredentials(appName);
    this.setState({ selectedStoredCredential: appName })
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

  credentialsChanged(credentials1, credentials2) {
    return credentials1.api.appId !== credentials2.api.appId || credentials1.api.apiKey !== credentials2.api.apiKey;
  }

  validCredentials = () => {
    return this.state.credentials.api.appId && this.state.credentials.api.apiKey;
  }

  renderCredentialsForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="ail-credentials-section ail-credentials">
          <label>Credentials</label>
          <input className="ail-input" value={this.state.credentials.api.appId}
            placeholder='App id'
            id="appId"
            disabled={!this.state.editing}
            onChange={(e) => this.handleChange(e)} />
          <input className="ail-input" value={this.state.credentials.api.apiKey}
            id="apiKey"
            placeholder='API key'
            disabled={!this.state.editing}
            onChange={(e) => this.handleChange(e)} />
          {
            this.state.editing ?
              <button className={`ail-btn ail-btn--success u-w100 u-mt-2 ${(!this.validCredentials() ? 'disabled' : '')}`}>
                Apply
              </button> :
              <button className={`ail-btn ail-btn--default u-w100 u-mt-2`}>Edit</button>
          }
        </div>
        {this.renderAppsDropDown()}
      </form>
    );
  }

  renderAppsDropDown() {
    if (this.props.availableApps.length === 0) {
      return '';
    }

    return (
      <div className="ail-credentials-section">
        <label>Switch apps</label>
        <select value={this.state.selectedStoredCredential}
          className="ail-input"
          onChange={(e) => this.checkStoredAppCredentials(e.target.value)}>
          <option>Saved apps</option>
          {this.props.availableApps.sort().map((appName, i) =>
            <option key={i} value={appName}>{appName}</option>
          )}
        </select>
      </div>
    );
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
        {this.props.credentials.authenticationType === AuthenticationType.apiKey ? this.renderCredentialsForm() : ''}
        {this.props.credentials.authenticationType === AuthenticationType.aad ? <AadResourcePicker /> : ''}
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
Credentials = connect(mapStateToProps, mapDispatchToProps)(Credentials);
export default Credentials;