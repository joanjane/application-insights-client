import { commonActionTypes } from '.';
import { errorCodes } from 'Modules/Shared/errorCodes';

export function errorAction(message, code) {
  return {
    type: commonActionTypes.ERROR,
    payload: {
      message,
      code: code ? code : errorCodes.Unknown
    }
  };
}