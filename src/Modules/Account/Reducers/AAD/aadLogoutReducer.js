import { aadAccountActionTypes } from 'Modules/Account/Actions/AAD';

export function aadLogoutReducer(state, action) {
  if (action.type !== aadAccountActionTypes.AAD_LOGOUT) return;

  state.account.aad = {
    subscriptionId: '',
    resourceId: '',
    appId: '',
    authenticated: false
  };

  return { ...state };
}