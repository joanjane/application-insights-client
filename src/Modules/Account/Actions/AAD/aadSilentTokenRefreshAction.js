import { aadAccountActionTypes } from '.';

export function aadSilentTokenRefreshAction(retryAction) {
  const payload = { };

  if (retryAction) {
    const retry = retryAction.retry ? retryAction.retry++ : 1;
    payload.retryAction = {...retryAction, retry };
  }

  return {
    type: aadAccountActionTypes.AAD_SILENT_REFRESH,
    payload
  };
}