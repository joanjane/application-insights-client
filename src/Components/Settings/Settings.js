import './Settings.css';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import AuthenticationType from 'Models/AuthenticationType';
import UISettings from './UI/UISettings';
import AadResourcePicker from './Account/AadResourcePicker';
import AuthenticationModeSelector from './Account/AuthenticationModeSelector';
import ApiKeyCredentials from './Account/ApiKeyCredentials';
import ClearDataButton from './Account/ClearDataButton';
import SearchPeriodSetting from './Search/SearchPeriodSetting';
import AutoRefreshSetting from './Search/AutoRefreshSetting';

const mapStateToProps = state => {
  return {
    authenticationType: state.account.authenticationType
  };
};

const mapDispatchToProps = dispatch => {
  return { };
};

class Settings extends Component {
  renderApplicationPicker() {
    return (
      <Fragment>
        {this.props.authenticationType === AuthenticationType.apiKey ? <ApiKeyCredentials /> : ''}
        {this.props.authenticationType === AuthenticationType.aad ? <AadResourcePicker /> : ''}
      </Fragment>
    );
  }

  renderGlobalSettings() {
    return (
      <div className="ail-account-section">
        <label>Settings</label>
        <ul className="ail-btn-list">
          <AutoRefreshSetting />
          <ClearDataButton />
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        <AuthenticationModeSelector />
        {this.renderApplicationPicker()}
        {this.renderGlobalSettings()}
        <SearchPeriodSetting />
        <UISettings />
      </div>
    );
  }
}

Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);
export default Settings;