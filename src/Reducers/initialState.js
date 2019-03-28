import AuthenticationType from 'Models/AuthenticationType';

export const initialState = () => {
  return {
    logs: [],
    credentials: {
      api: {
        appId: '',
        apiKey: '',
      },
      aad: {
        aadTenant: '',
        subscriptionId: '',
        resourceId: '',
        authenticated: false
      },
      authenticationType: AuthenticationType.none
    },
    query: 'traces | sort by timestamp desc | limit 50',
    searchPeriod: '',
    autoRefresh: true,
    refreshInterval: null,
    appName: null,
    fetchTime: null,
    loading: false,
    error: null,
    availableApps: [],
    aad: {
      subscriptionsApps: {},
      subscriptions: [],
    },
    ui: {
      theme: 'theme-default'
    }
  }
};