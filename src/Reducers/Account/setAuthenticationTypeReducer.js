import { SET_AUTH_TYPE } from 'Actions/Account';

export function setAuthenticationTypeReducer(state, action) {
  if (action.type !== SET_AUTH_TYPE) return;

  state.account.authenticationType = action.payload.authenticationType;

  return { ...state };
}