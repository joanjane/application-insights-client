import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  setCredentialsAction,
} from 'Actions/Profile';
import {
  listSubscriptionsAction,
  listAIAppsAction
} from 'Actions/Profile/Account';
import AuthenticationType from 'Models/AuthenticationType';
import { inject } from 'Store/container';

const aadAuthService = inject('AadAuthService');

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
      credentials: props.credentials,
      editing: false
    };
  }

  checkSubscriptionsLoad(props) {
    if (props.credentials.authenticationType === AuthenticationType.aad && props.credentials.aad.authenticated && props.subscriptions.length === 0) {
      this.props.listSubscriptions();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.credentials.aad.authenticated && this.credentialsChanged(nextProps.credentials, this.state.credentials)) {
      this.checkSubscriptionsLoad(nextProps);
      const nextSubscription = nextProps.credentials.aad.subscriptionId;
      if (
        nextSubscription &&
        this.state.credentials.aad.subscriptionId !== nextSubscription &&
        !nextProps.subscriptionsApps[nextSubscription]
      ) {
          this.props.listAIApps(nextSubscription);
      }
    }
    this.setState({
      credentials: {...nextProps.credentials}
    });
  }

  handleTenantChange = (event) => {
    let { aad } = this.state.credentials;
    aad = { ...aad, [event.target.id]: event.target.value };
    this.setState({ credentials: { ...this.state.credentials, aad }},
      () => this.props.setCredentials(this.state.credentials));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.checkSubscriptionsLoad(this.props);
    this.props.setCredentials(this.state.credentials);
    this.toggleEdit();
  }

  toggleEdit = (event) => {
    event && event.preventDefault();
    this.setState({ editing: !this.state.editing });
  }

  credentialsChanged(credentials1, credentials2) {
    return credentials1.aad.aadTenant !== credentials2.aad.aadTenant
      || credentials1.aad.resourceId !== credentials2.aad.resourceId
      || credentials1.aad.subscriptionId !== credentials2.aad.subscriptionId;
  }

  validCredentials = () => {
    return this.state.credentials.aad.aadTenant
      && this.state.credentials.aad.resourceId
      && this.state.credentials.aad.subscriptionId;
  }

  selectResource = (resourceId) => {
    let { aad } = this.state.credentials;
    aad = { ...aad, resourceId };
    this.props.setCredentials({...this.state.credentials, aad });
  }

  selectSubscription = (subscriptionId) => {
    let { aad } = this.state.credentials;
    const resourceId = '';
    aad = { ...aad, subscriptionId, resourceId };
    this.props.setCredentials({...this.state.credentials, aad });
  }

  renderCredentialsForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="ail-credentials-section ail-credentials">
          <label>AAD Tenant</label>
          <input className="ail-input" value={this.state.credentials.aad.aadTenant}
            placeholder='AAD Tenant (Ex: contoso.onmicrosoft.com)'
            title='AAD Tenant (Ex: contoso.onmicrosoft.com)'
            id="aadTenant"
            disabled={!this.state.editing}
            onChange={(e) => this.handleTenantChange(e)} />
        </div>
        {this.renderLoginButton()}
        {this.renderSubscriptionsDropDown()}
        {this.renderAppsDropDown()}
        <div>
          {
            this.state.editing ?
              <button className={`ail-btn ail-btn--success u-w100 u-mt-2 ${(!this.validCredentials() ? 'disabled' : '')}`}>
                Apply
              </button> :
              <button type="button" className={`ail-btn ail-btn--default u-w100 u-mt-2`} onClick={(e) => this.toggleEdit(e)}>Edit</button>
          }
        </div>
      </form>
    );
  }

  renderSubscriptionsDropDown() {
    if (!this.state.credentials.aad.authenticated) return '';
    const subscriptions = this.props.subscriptions;

    return (
      <div className="ail-credentials-section">
        <label>Selected subscription</label>
        <select value={this.state.credentials.aad.subscriptionId}
          disabled={!this.state.editing}
          className="ail-input"
          onChange={(e) => this.selectSubscription(e.target.value)}>
          <option value="">Select subscription</option>
          {subscriptions.map((subscription) =>
            <option key={subscription.id} value={subscription.id}>{subscription.name}</option>
          )}
        </select>
      </div>
    );
  }

  renderAppsDropDown() {
    if (!this.state.credentials.aad.authenticated) return '';
    const subscriptionApps = this.props.subscriptionsApps[this.state.credentials.aad.subscriptionId] || [];
    if (subscriptionApps.length === 0) {
      return '';
    }
    return (
      <div className="ail-credentials-section">
        <label>Selected Application</label>
        <select value={this.state.credentials.aad.resourceId}
          disabled={!this.state.editing}
          className="ail-input"
          onChange={(e) => this.selectResource(e.target.value)}>
          <option value="">Select application</option>
          {subscriptionApps.map((app) =>
            <option key={app.id} value={app.id}>{app.name}</option>
          )}
        </select>
      </div>
    );
  }

  renderLoginButton() {
    return (<Fragment>{
      this.props.credentials.aad.authenticated ?
          <button type="button" className={`ail-btn ail-btn--success u-w100 u-mt-2`} onClick={() => aadAuthService.logout()}>
            Logout
          </button> :
          <button type="button"
            className={`ail-btn ail-btn--default u-w100 u-mt-2 ${(!this.state.credentials.aad.aadTenant ? 'disabled' : '')}`}
            onClick={() => aadAuthService.redirectToSso()}>Login</button>
    }</Fragment>);
  }

  render() {
    return this.renderCredentialsForm();
  }
}
AadResourcePicker = connect(mapStateToProps, mapDispatchToProps)(AadResourcePicker);
export default AadResourcePicker;