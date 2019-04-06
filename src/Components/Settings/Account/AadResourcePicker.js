import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  setAADSubscriptionAction,
  setAADResourceAction,
} from 'Actions/Account/AAD';
import {
  listSubscriptionsAction,
  listAIAppsAction,
  aadLoginAction,
  aadLogoutAction,
} from 'Actions/Account/AAD';

const mapStateToProps = state => {
  return {
    subscriptionsApps: { ...state.account.appVaults.aad.subscriptionsApps },
    subscriptions: [...state.account.appVaults.aad.subscriptions],
    aad: { ...state.account.aad },
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAADSubscription: subscriptionId => dispatch(setAADSubscriptionAction(subscriptionId)),
    setAADResource: (resourceId, appId) => dispatch(setAADResourceAction(resourceId, appId)),
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
      aad: props.aad
    };
  }

  checkSubscriptionsLoad(props) {
    if (props.aad.authenticated && props.subscriptions.length === 0) {
      this.props.listSubscriptions();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.aad.authenticated) {
      this.checkSubscriptionsLoad(nextProps);
      const nextSubscription = nextProps.aad.subscriptionId;
      if (
        nextSubscription &&
        this.state.aad.subscriptionId !== nextSubscription &&
        !nextProps.subscriptionsApps[nextSubscription]
      ) {
        this.props.listAIApps(nextSubscription);
      }
    }
    this.setState({
      aad: { ...nextProps.aad }
    });
  }

  selectResource = (resourceId) => {
    const app = this.props.subscriptionsApps[this.state.aad.subscriptionId]
      .find(s => s.id === resourceId);

    const appId = app ? app.appId : '';
    this.props.setAADResource(resourceId, appId);
  }

  selectSubscription = (subscriptionId) => {
    this.props.setAADSubscription(subscriptionId);
    this.props.setAADResource();
  }

  renderSubscriptionsDropDown() {
    if (!this.state.aad.authenticated) return '';
    const subscriptions = this.props.subscriptions;

    return (
      <div className="ail-account-section">
        <label>Subscription</label>
        <div className="ail-select ail-select--refresh">
          <select value={this.state.aad.subscriptionId}
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
    if (!this.state.aad.authenticated) return '';
    const { subscriptionId, resourceId } = this.state.aad;
    const subscriptionApps = this.props.subscriptionsApps[subscriptionId] || [];

    return (
      <div className="ail-account-section">
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
      this.props.aad.authenticated ?
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
      <form>
        {this.renderLoginButton()}
        {this.renderSubscriptionsDropDown()}
        {this.renderAppsDropDown()}
      </form>
    );
  }
}
AadResourcePicker = connect(mapStateToProps, mapDispatchToProps)(AadResourcePicker);
export default AadResourcePicker;