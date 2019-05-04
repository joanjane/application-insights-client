import { aadAccountActionTypes } from 'Modules/Account/Actions/AAD';
import { aadAccountInitialState, aadAppVaultInitialState } from 'Modules/Account/Store/initialState';

export function aadLogoutReducer(state, action) {
  if (action.type !== aadAccountActionTypes.AAD_LOGOUT && action.type !== aadAccountActionTypes.AAD_CLEAR_ACCOUNT) return;

  state.account.aad = aadAccountInitialState();
  state.account.appVaults.aad = aadAppVaultInitialState();

  return { ...state };
}