import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  setAADSubscriptionAction,
  setAADResourceAction,
  listSubscriptionsAction,
  listAIAppsAction,
  aadLoginAction,
  aadLogoutAction,
  listAADTenantsAction,
  setAADTenantAction
} from 'Modules/Account/Actions/AAD';

const mapStateToProps = state => {
  return {
    subscriptionsApps: { ...state.account.appVaults.aad.subscriptionsApps },
    subscriptions: [...state.account.appVaults.aad.subscriptions],
    tenants: [...state.account.appVaults.aad.tenants],
    aad: { ...state.account.aad }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAADTenant: tenantId => dispatch(setAADTenantAction(tenantId)),
    setAADSubscription: subscriptionId => dispatch(setAADSubscriptionAction(subscriptionId)),
    setAADResource: (resourceId, appId) => dispatch(setAADResourceAction(resourceId, appId)),
    listTenants: () => dispatch(listAADTenantsAction()),
    listSubscriptions: () => dispatch(listSubscriptionsAction()),
    listAIApps: subscriptionId => dispatch(listAIAppsAction(subscriptionId)),
    login: () => dispatch(aadLoginAction()),
    logout: () => dispatch(aadLogoutAction()),
  };
};

class AadResourcePicker extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.aad.authenticated) {
      const authenticationChanged = nextProps.aad.authenticated !== this.props.aad.authenticated;
      if (authenticationChanged) {
        this.checkTenantsLoad(nextProps);
        this.checkSubscriptionsLoad(nextProps);
      }
      if (authenticationChanged || this.props.aad.subscriptionId !== nextProps.aad.subscriptionId) {
        this.checkAIAppsLoad(nextProps);
      }
    }
  }

  checkTenantsLoad(props) {
    if (props.aad.authenticated && props.tenants.length === 1) {
      this.props.listTenants();
    }
  }

  checkSubscriptionsLoad(props) {
    if (props.aad.authenticated && props.subscriptions.length === 0) {
      this.props.listSubscriptions();
    }
  }

  checkAIAppsLoad(props) {
    if (!props.aad.authenticated ||
      !props.aad.subscriptionId ||
      props.subscriptionsApps[props.aad.subscriptionId]
    ) {
      return;
    }

    this.props.listAIApps(props.aad.subscriptionId);
  }

  selectResource = (resourceId) => {
    const app = this.props.subscriptionsApps[this.props.aad.subscriptionId]
      .find(s => s.id === resourceId);

    const appId = app ? app.appId : '';
    this.props.setAADResource(resourceId, appId);
  }

  selectSubscription = (subscriptionId) => {
    this.props.setAADSubscription(subscriptionId);
    this.props.setAADResource();
  }

  selectTenant = (tenantId) => {
    this.props.setAADTenant(tenantId);
    this.props.login();
  }

  renderTenantsDropDown() {
    if (!this.props.aad.authenticated) return '';
    const tenants = this.props.tenants;

    return (
      <div className="ail-account-section">
        <label>Azure AD Tenant</label>
        <div className="ail-select ail-select--refresh">
          <select value={this.props.aad.tenantId}
            className="ail-input"
            onChange={(e) => this.selectTenant(e.target.value)}>
            {tenants.map((tenant) =>
              <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
            )}
          </select>
          <button type="button" className="ail-select-refresh_btn" title="Refresh" onClick={() => this.props.listTenants()}>
            <span role="img" aria-label="Refresh">🔄</span>
          </button>
        </div>
      </div>
    );
  }

  renderSubscriptionsDropDown() {
    if (!this.props.aad.authenticated) return '';
    const subscriptions = this.props.subscriptions;

    return (
      <div className="ail-account-section">
        <label>Subscription</label>
        <div className="ail-select ail-select--refresh">
          <select value={this.props.aad.subscriptionId}
            className="ail-input"
            onChange={(e) => this.selectSubscription(e.target.value)}>
            <option value="">Select subscription</option>
            {subscriptions.map((subscription) =>
              <option key={subscription.id} value={subscription.id}>{subscription.name}</option>
            )}
          </select>
          <button type="button" className="ail-select-refresh_btn" title="Refresh" onClick={() => this.props.listSubscriptions()}>
            <span role="img" aria-label="Refresh">🔄</span>
          </button>
        </div>
      </div>
    );
  }

  renderAppsDropDown() {
    if (!this.props.aad.authenticated) return '';
    const { subscriptionId, resourceId } = this.props.aad;
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
              <button type="button" className="ail-select-refresh_btn" title="Refresh" onClick={() => this.props.listAIApps(subscriptionId)}>
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
        {this.renderTenantsDropDown()}
        {this.renderSubscriptionsDropDown()}
        {this.renderAppsDropDown()}
      </form>
    );
  }
}
AadResourcePicker = connect(mapStateToProps, mapDispatchToProps)(AadResourcePicker);
export default AadResourcePicker;