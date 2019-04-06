import { AAD_AUTHENTICATED } from 'Actions/Account/AAD';

export function aadAuthenticatedReducer(state, action) {
  if (action.type !== AAD_AUTHENTICATED) return;

  state.account.aad.authenticated = action.payload.authenticated;

  return { ...state };
}