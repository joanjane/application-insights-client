import { AAD_LOGOUT } from 'Actions/Profile/Account';

export function aadLogoutReducer(state, action) {
  if (action.type !== AAD_LOGOUT) return;
  const aad = {
    subscriptionId: '',
    resourceId: '',
    appId: '',
    authenticated: false
  };
  return { ...state, credentials: { ...state.credentials, aad} };
}