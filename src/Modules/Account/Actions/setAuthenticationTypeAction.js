import { accountActionTypes } from '.';

export function setAuthenticationTypeAction(authenticationType) {
  return { type: accountActionTypes.SET_AUTH_TYPE, payload: { authenticationType } };
}