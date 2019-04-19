import { commonActionTypes } from 'Modules/Shared/Actions';
import { errorCodes } from 'Modules/Shared/errorCodes';

export function errorReducer(state, action) {
  if (action.type !== commonActionTypes.ERROR) return;

  const error = typeof(action.payload) === 'string' ?
    { message: action.payload, code: errorCodes.Unknown, details: null } :
    action.payload;

  if (error.code === errorCodes.InvalidAuthenticationTokenTenant) {
    state.account.aad.tenantId = '';
    state.account.aad.subscriptionId = '';
    state.account.aad.resourceId = '';
    state.account.aad.appId = '';
    state.account.aad.authenticated = false;
  }

  state.errors = [...state.errors, error ];

  state.search.loading = false;

  return { ...state };
}