
import { aadAccountActionTypes } from 'Modules/Account/Actions/AAD';

export function aadTenantsReducer(state, action) {
  if (action.type !== aadAccountActionTypes.AAD_TENANTS_LOADED) return;

  let { tenants } = action.payload;
  state.account.appVaults.aad = { ...state.account.appVaults.aad, tenants };

  return { ...state };
}