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
    ui: {
      theme: 'theme-default'
    }
  }
};