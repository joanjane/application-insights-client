export const initialState = () => {
  return {
    logs: [],
    credentials: {
      appId: '',
      apiKey: ''
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