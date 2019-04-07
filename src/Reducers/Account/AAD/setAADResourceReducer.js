import { aadAccountActionTypes } from 'Actions/Account/AAD';

export function setAADResourceReducer(state, action) {
  if (action.type !== aadAccountActionTypes.SET_AAD_RESOURCE) return;

  state.account.aad.resourceId = action.payload.resourceId;
  state.account.aad.appId = action.payload.appId;

  return { ...state };
}