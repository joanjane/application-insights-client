import { aadAccountActionTypes } from '.';

export function aadLoginAction() {
  return { type: aadAccountActionTypes.AAD_LOGIN, payload: {} };
}