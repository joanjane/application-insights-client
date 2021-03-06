import { aadAccountActionTypes } from '.';

export function aadSilentTokenRefreshAction(retryAction) {
  const payload = { };

  if (retryAction) {
    const retry = retryAction.retry + 1;
    payload.retryAction = { type: retryAction.type, payload: retryAction.payload, retry };
  }

  return {
    type: aadAccountActionTypes.AAD_SILENT_REFRESH,
    payload
  };
}