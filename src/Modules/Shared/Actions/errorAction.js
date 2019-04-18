import { commonActionTypes } from '.';

export function errorAction(reason) {
  return { type: commonActionTypes.ERROR, payload: reason };
}