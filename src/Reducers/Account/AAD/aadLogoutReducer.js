import { AAD_LOGOUT } from 'Actions/Account/AAD';

export function aadLogoutReducer(state, action) {
  if (action.type !== AAD_LOGOUT) return;

  state.account.aad = {
    subscriptionId: '',
    resourceId: '',
    appId: '',
    authenticated: false
  };

  return { ...state };
}