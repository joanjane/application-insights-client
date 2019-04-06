import { SET_AAD_RESOURCE } from 'Actions/Account/AAD';

export function setAADResourceReducer(state, action) {
  if (action.type !== SET_AAD_RESOURCE) return;

  state.account.aad.resourceId = action.payload.resourceId;
  state.account.aad.appId = action.payload.appId;

  return { ...state };
}