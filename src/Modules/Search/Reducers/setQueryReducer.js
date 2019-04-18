import { searchActionTypes } from 'Modules/Search/Actions';

export function setQueryReducer(state, action) {
  if (action.type !== searchActionTypes.SET_QUERY) return;

  state.search.query = action.payload.query || '';

  return { ...state };
}
