import { aadAccountActionTypes } from '.';

export function aadClearAccountAction() {
  return { type: aadAccountActionTypes.AAD_CLEAR_ACCOUNT, payload: {} };
}
