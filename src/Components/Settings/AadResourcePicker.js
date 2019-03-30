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
      credentials: props.credentials
    };
  }

  checkSubscriptionsLoad(props) {
    if (props.credentials.authenticationType === AuthenticationType.aad && props.credentials.aad.authenticated && props.subscriptions.length === 0) {
      this.props.listSubscriptions();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.credentials.aad.authenticated) {
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
  }

  credentialsChanged(credentials1, credentials2) {
    return credentials1.aad.resourceId !== credentials2.aad.resourceId
      || credentials1.aad.subscriptionId !== credentials2.aad.subscriptionId;
  }

  validCredentials = () => {
    return this.state.credentials.aad.resourceId
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
        {this.renderLoginButton()}
        {this.renderSubscriptionsDropDown()}
        {this.renderAppsDropDown()}
      </form>
    );
  }

  renderSubscriptionsDropDown() {
    if (!this.state.credentials.aad.authenticated) return '';
    const subscriptions = this.props.subscriptions;

    return (
      <div className="ail-credentials-section">
        <label>Subscription</label>
        <select value={this.state.credentials.aad.subscriptionId}
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
        <label>Application Insights Resource</label>
        <select value={this.state.credentials.aad.resourceId}
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
            Logout <span role="img" aria-label="lock">🔒</span>
          </button> :
          <button type="button"
            className={`ail-btn ail-btn--default u-w100 u-mt-2`}
            onClick={() => aadAuthService.redirectToSso()}>Login <span role="img" aria-label="key">🔑</span></button>
    }</Fragment>);
  }

  render() {
    return this.renderCredentialsForm();
  }
}
AadResourcePicker = connect(mapStateToProps, mapDispatchToProps)(AadResourcePicker);
export default AadResourcePicker;