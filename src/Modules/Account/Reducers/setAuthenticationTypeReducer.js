import { accountActionTypes } from 'Modules/Account/Actions';

export function setAuthenticationTypeReducer(state, action) {
  if (action.type !== accountActionTypes.SET_AUTH_TYPE) return;

  state.account.authenticationType = action.payload.authenticationType;

  return { ...state };
}