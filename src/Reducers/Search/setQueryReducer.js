import { SET_QUERY } from 'Actions/Search';

export function setQueryReducer(state, action) {
  if (action.type !== SET_QUERY) return;

  state.search.query = action.payload.query || '';

  return { ...state };
}
