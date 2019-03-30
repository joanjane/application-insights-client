import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setCredentialsAction,
} from 'Actions/Profile';
import AuthenticationType from 'Models/AuthenticationType';

const mapStateToProps = state => {
  return {
    credentials: { ...state.credentials }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCredentials: credentials => dispatch(setCredentialsAction(credentials))
  };
};

class AuthenticationModeSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: props.credentials
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      credentials: { ...nextProps.credentials }
    });
  }

  changeAuthentication = (authenticationType) => {
    this.props.setCredentials({ ...this.state.credentials, authenticationType });
  }

  isActive(authenticationType) {
    return this.props.credentials.authenticationType === authenticationType;
  }

  render() {
    return (
      <div>
        <label>Authentication Mode</label>
        <div className="ail-btn-group">
          <button type="button" className={`ail-btn ${this.isActive(AuthenticationType.aad) ? 'is-active' : ''} u-mt-2`}
            title="Connect to Application Insights using an Azure Active Directory account"
            onClick={() => this.changeAuthentication(AuthenticationType.aad)}>
            AAD
          </button>
          <button type="button" className={`ail-btn ${this.isActive(AuthenticationType.apiKey) ? 'is-active' : ''} u-mt-2`}
            title="Connect to Application Insights using an AppID and Api key"
            onClick={() => this.changeAuthentication(AuthenticationType.apiKey)}>
            API Key
          </button>
        </div>
      </div>
    );
  }
}
AuthenticationModeSelector = connect(mapStateToProps, mapDispatchToProps)(AuthenticationModeSelector);
export default AuthenticationModeSelector;