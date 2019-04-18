export const initialState = (state) => {
  state.search = {
    logs: [],
    query: 'traces | sort by timestamp desc | limit 50',
    searchPeriod: '',
    autoRefresh: true,
    appName: '',
    fetchTime: null,
    loading: false,
  };
  return state;
}