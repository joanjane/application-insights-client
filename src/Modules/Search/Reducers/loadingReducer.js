import { searchActionTypes } from 'Modules/Search/Actions';

export function loadingReducer(state, action) {
  if (action.type !== searchActionTypes.LOADING) return;

  state.search.loading = true;

  return { ...state };
}
