import { accountActionTypes } from '.';

export function clearDataAction() {
  return { type: accountActionTypes.CLEAR_DATA, payload: null };
}