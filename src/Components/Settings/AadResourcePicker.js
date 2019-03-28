import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setCredentialsAction,
} from 'Actions/Profile';
import {
  listSubscriptionsAction,
  listAIAppsAction
} from 'Actions/Profile/Account';
import AuthenticationType from 'Models/AuthenticationType';
import './Credentials.css';

const mapStateToProps = state => {
  return {
    subscriptionsApps: {...state.aad.subscriptionsApps},
    subscriptions: [...state.aad.subscriptions],
    credentials: {...state.credentials}
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCredentials: credentials => dispatch(setCredentialsAction(credentials)),
    listSubscriptions: () => dispatch(listSubscriptionsAction()),
    listAIApps: subscriptionId => dispatch(listAIAppsAction(subscriptionId))
  };
};

class AadResourcePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: props.credentials
    };
  }

  componentDidMount() {
    if (this.props.subscriptions.length === 0) {
      this.checkSubscriptionsLoad();
    }
  }

  checkSubscriptionsLoad() {
    if (this.props.credentials.authenticationType === AuthenticationType.aad && this.props.credentials.aad.authenticated) {
      this.props.listSubscriptions();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.credentialsChanged(nextProps.credentials, this.state.credentials)) {
      this.setState({
        credentials: {...nextProps.credentials}
      });
    }
  }

  handleTenantChange = (event) => {
    let { aad } = this.state.credentials;
    aad = { ...aad, [event.target.id]: event.target.value };
    this.setState({ credentials: { ...this.state.credentials, aad }});
    this.props.setCredentials(this.state.credentials);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.checkSubscriptionsLoad();
    if (!this.state.editing) {
      this.setState({ editing: !this.state.editing });
      return;
    }
    this.props.setCredentials(this.state.credentials);
    this.setState({ editing: !this.state.editing });
  }

  credentialsChanged(credentials1, credentials2) {
    return credentials1.aad.aadTenant !== credentials2.aad.aadTenant
      || credentials1.aad.resourceId !== credentials2.aad.resourceId
      || credentials1.aad.subscriptionId !== credentials2.aad.subscriptionId;
  }

  validCredentials = () => {
    return true;
    // return this.state.credentials.aad.aadTenant
    //   && this.state.credentials.aad.resourceId
    //   && this.state.credentials.aad.subscriptionId;
  }

  selectResource = (resourceId) => {
    this.setState({ credentials: {...this.state.credentials, resourceId }});
    this.props.setCredentials(this.state.credentials);
  }

  selectSubscription = (subscriptionId) => {
    this.setState({ credentials: {...this.state.credentials, subscriptionId }});
    this.props.setCredentials(this.state.credentials);
  }

  renderCredentialsForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="ail-credentials-section ail-credentials">
          <label>Connected AAD Tenant</label>
          <input className="ail-input" value={this.state.credentials.aad.aadTenant}
            placeholder='AAD Tenant (Ex: contoso.onmicrosoft.com)'
            title='AAD Tenant (Ex: contoso.onmicrosoft.com)'
            id="aadTenant"
            disabled={!this.state.editing}
            onChange={(e) => this.handleTenantChange(e)} />

        </div>
        {this.renderSubscriptionsDropDown()}
        {this.renderAppsDropDown()}
        <div>
          {
            this.state.editing ?
              <button className={`ail-btn ail-btn--success u-w100 u-mt-2 ${(!this.validCredentials() ? 'disabled' : '')}`}>
                Apply
              </button> :
              <button className={`ail-btn ail-btn--default u-w100 u-mt-2`}>Edit</button>
          }
        </div>
      </form>
    );
  }

  renderSubscriptionsDropDown() {
    const subscriptions = this.props.subscriptions;

    return (
      <div className="ail-credentials-section">
        <label>Selected subscription</label>
        <select value={this.state.credentials.aad.subscriptionId}
          className="ail-input"
          onChange={(e) => this.selectSubscription(e.target.value)}>
          <option>Select subscription</option>
          {subscriptions.map((subscription) =>
            <option key={subscription.id} value={subscription.id}>{subscription.name}</option>
          )}
        </select>
      </div>
    );
  }

  renderAppsDropDown() {
    const subscriptionApps = this.props.subscriptionsApps[this.state.credentials.aad.subscriptionId] || [];
    if (subscriptionApps.length === 0) {
      return '';
    }
    return (
      <div className="ail-credentials-section">
        <label>Selected Application</label>
        <select value={this.state.credentials.aad.resourceId}
          className="ail-input"
          onChange={(e) => this.selectResource(e.target.value)}>
          <option>Select application</option>
          {subscriptionApps.map((app) =>
            <option key={app.id} value={app.id}>{app.name}</option>
          )}
        </select>
      </div>
    );
  }

  render() {
    return this.renderCredentialsForm();
  }
}
AadResourcePicker = connect(mapStateToProps, mapDispatchToProps)(AadResourcePicker);
export default AadResourcePicker;