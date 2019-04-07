import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setApiKeyCredentialsAction,
  tryFindApiCredentialsAction
} from 'Actions/Account/ApiKey';

const mapStateToProps = state => {
  return {
    availableApps: [...state.account.appVaults.apiKey.availableApps],
    credentials: { ...state.account.apiKey }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setApiKeyCredentials: (appId, apiKey) => dispatch(setApiKeyCredentialsAction(appId, apiKey)),
    tryFindCredentials: appName => dispatch(tryFindApiCredentialsAction(appName)),
  };
};

class ApiKeyCredentials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: { ...props.credentials },
      availableApps: props.availableApps,
      selectedStoredCredential: props.credentials.appId,
      editing: !props.credentials.appId
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.editing && this.accountChanged(nextProps.credentials, this.state.credentials)) {
      this.setState({
        credentials: nextProps.credentials,
        selectedStoredCredential: nextProps.credentials.appId,
      });
    }
  }

  handleChange = (event) => {
    let { credentials } = this.state;
    credentials = { ...credentials, [event.target.id]: event.target.value };
    this.setState({ credentials: { ...this.state.credentials, ...credentials } });
  }


  handleSubmit = (event) => {
    event.preventDefault();

    this.props.setApiKeyCredentials(
      this.state.credentials.appId,
      this.state.credentials.apiKey,
    );
    this.setState({ selectedStoredCredential: this.state.credentials.appId });

    this.toggleEdit();
  }

  checkStoredAppCredentials(appId) {
    this.setState({ editing: false });
    this.props.tryFindCredentials(appId);
    this.setState({ selectedStoredCredential: appId })
  }

  accountChanged(credentials1, credentials2) {
    return credentials1.appId !== credentials2.appId || credentials1.apiKey !== credentials2.apiKey;
  }

  validCredentials = () => {
    return this.state.credentials.appId && this.state.credentials.apiKey;
  }

  toggleEdit = (event) => {
    event && event.preventDefault();
    this.setState({ editing: !this.state.editing });
  }

  renderCredentialsForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="ail-account-section ail-account">
          <label>Credentials</label>
          <input className="ail-input" value={this.state.credentials.appId}
            placeholder='App id'
            id="appId"
            disabled={!this.state.editing}
            onChange={(e) => this.handleChange(e)} />
          <input className="ail-input" value={this.state.credentials.apiKey}
            id="apiKey"
            placeholder='API key'
            disabled={!this.state.editing}
            onChange={(e) => this.handleChange(e)} />
          {
            this.state.editing ?
              <button className={`ail-btn ail-btn--success u-w100 u-mt-2 ${(!this.validCredentials() ? 'disabled' : '')}`}>
                Apply
              </button> :
              <button type="button" className={`ail-btn ail-btn--default u-w100 u-mt-2`}
                onClick={(e) => this.toggleEdit(e)}>Edit</button>
          }
        </div>
      </form>
    );
  }

  renderAppsDropDown() {
    if (this.props.availableApps.length === 0) {
      return '';
    }

    return (
      <div className="ail-account-section">
        <label>Switch apps</label>
        <select value={this.state.selectedStoredCredential}
          className="ail-input"
          onChange={(e) => this.checkStoredAppCredentials(e.target.value)}>
          <option>Saved apps</option>
          {this.props.availableApps.sort().map((app, i) =>
            <option key={app.appId} value={app.appId}>{app.appName}</option>
          )}
        </select>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderCredentialsForm()}
        {this.renderAppsDropDown()}
      </div>
    );
  }
}
ApiKeyCredentials = connect(mapStateToProps, mapDispatchToProps)(ApiKeyCredentials);
export default ApiKeyCredentials;