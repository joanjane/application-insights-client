import {accountActionTypes} from '.';

export function authenticationChangedAction() {
  return { type: accountActionTypes.AUTHENTICATION_CHANGED, payload: { }};
}