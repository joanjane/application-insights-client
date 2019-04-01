import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setCredentialsAction,
  tryFindApiCredentialsAction
} from 'Actions/Profile';

const mapStateToProps = state => {
  return {
    availableApps: [...state.availableApps],
    credentials: { ...state.credentials }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCredentials: credentials => dispatch(setCredentialsAction(credentials)),
    tryFindCredentials: appName => dispatch(tryFindApiCredentialsAction(appName)),
  };
};

class ApiKeyCredentials extends Component {
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


  handleSubmit = (event) => {
    event.preventDefault();

    const { api } = this.state.credentials;
    this.props.setCredentials({
      ...this.state.credentials,
      api
    });
    this.toggleEdit();
  }

  checkStoredAppCredentials(appName) {
    this.setState({ editing: false });
    this.props.tryFindCredentials(appName);
    this.setState({ selectedStoredCredential: appName })
  }

  credentialsChanged(credentials1, credentials2) {
    return credentials1.api.appId !== credentials2.api.appId || credentials1.api.apiKey !== credentials2.api.apiKey;
  }

  validCredentials = () => {
    return this.state.credentials.api.appId && this.state.credentials.api.apiKey;
  }

  toggleEdit = (event) => {
    event && event.preventDefault();
    this.setState({ editing: !this.state.editing });
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