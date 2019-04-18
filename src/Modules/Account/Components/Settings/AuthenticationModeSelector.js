import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setAuthenticationTypeAction,
} from 'Modules/Account/Actions';
import { AuthenticationType } from 'Modules/Account/Models';

const mapStateToProps = state => {
  return {
    authenticationType: state.account.authenticationType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAuthenticationType: type => dispatch(setAuthenticationTypeAction(type))
  };
};

class AuthenticationModeSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticationType: props.authenticationType
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      authenticationType: nextProps.authenticationType
    });
  }

  changeAuthentication = (authenticationType) => {
    this.props.setAuthenticationType(authenticationType);
  }

  isActive(authenticationType) {
    return this.props.authenticationType === authenticationType;
  }

  render() {
    return (
      <div>
        <label>Authentication Mode</label>
        <div className="ail-btn-group">
          <button type="button" className={`ail-btn ${this.isActive(AuthenticationType.aad) ? 'is-active' : ''} u-mt-2`}
            title="Connect to Application Insights using an Azure Active Directory account"
            onClick={() => this.changeAuthentication(AuthenticationType.aad)}>
            Azure AD
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