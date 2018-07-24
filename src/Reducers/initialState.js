export const initialState = () => {
  return {
    logs: [],
    credentials: {
      appId: '',
      apiKey: ''
    },
    query: 'traces | sort by timestamp desc | limit 50',
    autoRefresh: true,
    refreshInterval: null,
    appName: null,
    fetchTime: null,
    loading: false,
    error: null,
    availableApps: []
  }
};