import { AuthenticationType } from 'Modules/Account/Models';

export const initialState = (state) => {
  state.account = {
    apiKey: {
      appId: '',
      apiKey: ''
    },
    aad: {
      tenantId: 'common',
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
        tenants: [{id: 'common', name: 'common'}]
      },
    },
  };
  return state;
}