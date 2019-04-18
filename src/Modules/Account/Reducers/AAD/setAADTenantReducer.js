import { aadAccountActionTypes } from 'Modules/Account/Actions/AAD';

export function setAADTenantReducer(state, action) {
  if (action.type !== aadAccountActionTypes.SET_AAD_TENANT) return;

  state.account.aad.tenantId = action.payload.tenantId;

  return { ...state };
}