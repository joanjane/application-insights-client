import { accountActionTypes } from '.';

export function profileLoadedAction() {
  return { type: accountActionTypes.PROFILE_LOADED };
}