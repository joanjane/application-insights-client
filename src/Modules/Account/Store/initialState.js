import { AuthenticationType } from 'Modules/Account/Models';

export const initialState = (state) => {
  state.account = {
    authenticationType: AuthenticationType.aad,
    apiKey: apiKeyAccountInitialState(),
    aad: aadAccountInitialState(),
    appVaults: {
      apiKey: apiKeyAppVaultInitialState(),
      aad: aadAppVaultInitialState(),
    },
  };
  return state;
}

export function apiKeyAccountInitialState() {
  return {
    appId: '',
    apiKey: ''
  };
}

export function apiKeyAppVaultInitialState() {
  return {
    availableApps: [],
  };
}

export function aadAppVaultInitialState() {
  return {
    subscriptionsApps: {},
    subscriptions: [],
    tenants: []
  };
}

export function aadAccountInitialState() {
  return {
    tenantId: '',
    subscriptionId: '',
    resourceId: '',
    appId: '',
    authenticated: false
  };
}
