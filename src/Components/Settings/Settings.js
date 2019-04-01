import './Settings.css';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import AuthenticationType from 'Models/AuthenticationType';
import UISettings from './UISettings';
import AadResourcePicker from './AadResourcePicker';
import AuthenticationModeSelector from './AuthenticationModeSelector';
import ApiKeyCredentials from './ApiKeyCredentials';
import SearchPeriodSetting from './SearchPeriodSetting';
import GlobalSettings from './GlobalSettings';

const mapStateToProps = state => {
  return {
    authenticationType: state.credentials.authenticationType
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

  render() {
    return (
      <div>
        <AuthenticationModeSelector />
        {this.renderApplicationPicker()}
        <GlobalSettings />
        <SearchPeriodSetting />
        <UISettings />
      </div>
    );
  }
}
Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);
export default Settings;