import {
  clearDataReducer,
  setAuthenticationTypeReducer
} from '.';

import {
  aadSubscriptionsReducer,
  aadSubscriptionAppsReducer,
  setAADResourceReducer,
  setAADSubscriptionReducer,
  aadAuthenticatedReducer,
  aadLogoutReducer,
  aadTenantsReducer,
  setAADTenantReducer
} from './AAD';

import {
  availableApiKeyAppsReducer,
  setApiKeyCredentialsReducer,
} from './ApiKey';

export const reducers = [
  clearDataReducer,
  setAuthenticationTypeReducer,

  availableApiKeyAppsReducer,
  setApiKeyCredentialsReducer,

  aadSubscriptionsReducer,
  aadSubscriptionAppsReducer,
  setAADResourceReducer,
  setAADSubscriptionReducer,
  aadAuthenticatedReducer,
  aadLogoutReducer,
  aadTenantsReducer,
  setAADTenantReducer
];