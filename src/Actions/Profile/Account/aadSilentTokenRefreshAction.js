export const AAD_SILENT_REFRESH = 'AAD_SILENT_REFRESH';

export function aadSilentTokenRefreshAction(retryAction) {
  const retry = retryAction.retry ? retryAction.retry++ : 1;
  return {
    type: AAD_SILENT_REFRESH,
    payload: {
      retryAction: {...retryAction, retry }
    }
  };
}