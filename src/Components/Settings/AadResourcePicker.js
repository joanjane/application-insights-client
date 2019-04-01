import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  setCredentialsAction,
} from 'Actions/Profile';
import {
  listSubscriptionsAction,
  listAIAppsAction,
  aadLoginAction,
  aadLogoutAction,
} from 'Actions/Profile/Account';
import AuthenticationType from 'Models/AuthenticationType';

const mapStateToProps = state => {
  return {
    subscriptionsApps: { ...state.aad.subscriptionsApps },
    subscriptions: [...state.aad.subscriptions],
    credentials: { ...state.credentials }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCredentials: credentials => dispatch(setCredentialsAction(credentials)),
    listSubscriptions: () => dispatch(listSubscriptionsAction()),
    listAIApps: subscriptionId => dispatch(listAIAppsAction(subscriptionId)),
    login: () => dispatch(aadLoginAction()),
    logout: () => dispatch(aadLogoutAction()),
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
      credentials: { ...nextProps.credentials }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.checkSubscriptionsLoad(this.props);
    this.props.setCredentials(this.state.credentials);
  }

  validCredentials = () => {
    return this.state.credentials.aad.resourceId
      && this.state.credentials.aad.subscriptionId;
  }

  selectResource = (resourceId) => {
    const app = this.props.subscriptionsApps[this.state.credentials.aad.subscriptionId]
      .find(s => s.id === resourceId);

    let { aad } = this.state.credentials;
    const appId = app ? app.appId : '';
    aad = { ...aad, resourceId, appId };
    this.props.setCredentials({ ...this.state.credentials, aad });
  }

  selectSubscription = (subscriptionId) => {
    let { aad } = this.state.credentials;
    const resourceId = '';
    const appId = '';
    aad = { ...aad, subscriptionId, resourceId, appId };
    this.props.setCredentials({ ...this.state.credentials, aad });
  }

  renderSubscriptionsDropDown() {
    if (!this.state.credentials.aad.authenticated) return '';
    const subscriptions = this.props.subscriptions;

    return (
      <div className="ail-credentials-section">
        <label>Subscription</label>
        <div className="ail-select ail-select--refresh">
          <select value={this.state.credentials.aad.subscriptionId}
            className="ail-input"
            onChange={(e) => this.selectSubscription(e.target.value)}>
            <option value="">Select subscription</option>
            {subscriptions.map((subscription) =>
              <option key={subscription.id} value={subscription.id}>{subscription.name}</option>
            )}
          </select>
          <button className="ail-select-refresh_btn" title="Refresh" onClick={() => this.props.listSubscriptions()}>
            <span role="img" aria-label="Refresh">🔄</span>
          </button>
        </div>
      </div>
    );
  }

  renderAppsDropDown() {
    if (!this.state.credentials.aad.authenticated) return '';
    const { subscriptionId, resourceId } = this.state.credentials.aad;
    const subscriptionApps = this.props.subscriptionsApps[subscriptionId] || [];

    return (
      <div className="ail-credentials-section">
        <label>Application Insights Resource</label>
        <div className="ail-select ail-select--refresh">
          <select value={resourceId}
            className="ail-input"
            onChange={(e) => this.selectResource(e.target.value)}>
            <option value="">Select application</option>
            {subscriptionApps.map((app) =>
              <option key={app.id} value={app.id}>{app.name}</option>
            )}
          </select>
          {
            subscriptionId ?
              <button className="ail-select-refresh_btn" title="Refresh" onClick={() => this.props.listAIApps(subscriptionId)}>
                <span role="img" aria-label="Refresh">🔄</span>
              </button> :
              ''
          }
        </div>
      </div>
    );
  }

  login = () => {
    this.props.login();
  }

  logout = () => {
    this.props.logout();
  }

  renderLoginButton() {
    return (<Fragment>{
      this.props.credentials.aad.authenticated ?
        <button type="button" className={`ail-btn ail-btn--success u-w100 u-mt-2`} onClick={() => this.logout()}>
          Logout <span role="img" aria-label="lock">🔒</span>
        </button> :
        <button type="button"
          className={`ail-btn ail-btn--default u-w100 u-mt-2`}
          onClick={() => this.login()}>Login <span role="img" aria-label="key">🔑</span></button>
    }</Fragment>);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderLoginButton()}
        {this.renderSubscriptionsDropDown()}
        {this.renderAppsDropDown()}
      </form>
    );
  }
}
AadResourcePicker = connect(mapStateToProps, mapDispatchToProps)(AadResourcePicker);
export default AadResourcePicker;