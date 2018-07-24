import { PROFILE_LOADED } from '../../Actions/Profile';

export function profileLoadedReducer(state, action) {
  if (action.type !== PROFILE_LOADED) return;
  const loadedProps = {};
  if (action.payload.credentials) {
    loadedProps.credentials = action.payload.credentials;
  }
  if (action.payload.query) {
    loadedProps.query = action.payload.query;
  }
  return { ...state, ...loadedProps };
}