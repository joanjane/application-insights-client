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
        subscriptionId: '',
        resourceId: '',
        appId: '',
        authenticated: false
      },
      authenticationType: AuthenticationType.aad
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