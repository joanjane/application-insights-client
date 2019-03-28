import { PROFILE_LOADED } from 'Actions/Profile';

export function profileLoadedReducer(state, action) {
  if (action.type !== PROFILE_LOADED) return;
  let { credentials } = state;
  if (action.payload.credentials) {
    credentials.authenticationType = action.payload.authenticationType;
    credentials.aad = {...credentials.aad, ...action.payload.credentials.aad};
    credentials.api = {...credentials.api, ...action.payload.credentials.api};
  }
  let query = state.query;
  if (action.payload.query) {
    query = action.payload.query;
  }
  return { ...state, credentials, query };
}