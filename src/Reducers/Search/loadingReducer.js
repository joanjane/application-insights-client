import { searchActionTypes, AUTOREFRESH_GET_LOGS_SOURCE } from 'Actions/Search';

export function loadingReducer(state, action) {
  if (action.type !== searchActionTypes.LOADING) return;

  const skipLoading = action.payload.source === AUTOREFRESH_GET_LOGS_SOURCE && state.error;
  state.search.loading = skipLoading ? false : true;

  return { ...state };
}
