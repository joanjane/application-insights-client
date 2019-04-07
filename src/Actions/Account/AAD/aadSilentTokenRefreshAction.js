import { aadAccountActionTypes } from '.';

export function aadSilentTokenRefreshAction(retryAction) {
  const retry = retryAction.retry ? retryAction.retry++ : 1;
  return {
    type: aadAccountActionTypes.AAD_SILENT_REFRESH,
    payload: {
      retryAction: {...retryAction, retry }
    }
  };
}