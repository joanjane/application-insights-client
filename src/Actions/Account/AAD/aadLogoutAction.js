import { aadAccountActionTypes } from '.';

export function aadLogoutAction() {
  return { type: aadAccountActionTypes.AAD_LOGOUT, payload: {} };
}