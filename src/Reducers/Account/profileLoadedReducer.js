import { PROFILE_LOADED } from 'Actions/Account';

export function profileLoadedReducer(state, action) {
  if (action.type !== PROFILE_LOADED) return;

  let account = {...state.account};
  if (action.payload.account) {
    account.authenticationType = action.payload.account.authenticationType;
    account.aad = {...account.aad, ...action.payload.account.aad};
    account.api = {...account.api, ...action.payload.account.api};
  }
  let { query } = state;
  if (action.payload.query) {
    state.search.query = query;
  }
  const newState = { ...state, account };
  return newState;
}