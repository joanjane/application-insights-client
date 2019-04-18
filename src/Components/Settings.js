import './Settings.css';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { AuthenticationType } from 'Modules/Account/Models';
import UISettings from 'Modules/UI/Components/UISettings';
import AadResourcePicker from 'Modules/Account/Components/Settings/AadResourcePicker';
import AuthenticationModeSelector from 'Modules/Account/Components/Settings/AuthenticationModeSelector';
import ApiKeyCredentials from 'Modules/Account/Components/Settings/ApiKeyCredentials';
import ClearDataButton from 'Modules/Account/Components/Settings/ClearDataButton';
import SearchPeriodSetting from 'Modules/Search/Components/Settings/SearchPeriodSetting';
import AutoRefreshSetting from 'Modules/Search/Components/Settings/AutoRefreshSetting';

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