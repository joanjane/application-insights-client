import { aadAccountActionTypes } from 'Actions/Account/AAD';

export function aadAuthenticatedReducer(state, action) {
  if (action.type !== aadAccountActionTypes.AAD_AUTHENTICATED) return;

  state.account.aad.authenticated = action.payload.authenticated;

  return { ...state };
}