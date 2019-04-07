import AuthenticationType from 'Models/AuthenticationType';

export const initialState = () => {
  return {
    search: {
      logs: [],
      query: 'traces | sort by timestamp desc | limit 50',
      searchPeriod: '',
      autoRefresh: true,
      appName: '',
      fetchTime: null,
      loading: false,
    },
    account: {
      apiKey: {
        appId: '',
        apiKey: ''
      },
      aad: {
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
        },
      },
    },
    error: null,
    ui: {
      theme: 'theme-default'
    }
  };
}