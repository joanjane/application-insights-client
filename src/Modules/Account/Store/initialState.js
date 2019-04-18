import { AuthenticationType } from 'Modules/Account/Models';

export const initialState = (state) => {
  state.account = {
    apiKey: {
      appId: '',
      apiKey: ''
    },
    aad: {
      tenantId: 'organizations',
      subscriptionId: '',
      resourceId: '',
      appId: '',
      authenticated: false
    },
    authenticationType: AuthenticationType.aad,
    appVaults: {
      apiKey: {
        availableApps: [],
      },
      aad: {
        subscriptionsApps: {},
        subscriptions: [],
        tenants: [{id: 'organizations', name: 'organizations (default)'}]
      },
    },
  };
  return state;
}