import { of } from 'rxjs';
import { errorAction } from 'Modules/Shared/Actions';
import { retryExceeded } from 'Modules/Shared/retryExceeded';
import { aadSilentTokenRefreshAction, aadLogoutAction } from 'Modules/Account/Actions/AAD';
import { errorCodes } from 'Modules/Shared/errorCodes';
import { AuthenticationType } from 'Modules/Account/Models';

export function handleError(response, action, unknownErrorMessage, state) {
  if (response.status === 401 && response.response.error && response.response.error.code === errorCodes.InvalidAuthenticationTokenTenant) {
    return of(aadLogoutAction());
  }

  if (response.status === 401 && !retryExceeded(action) && state.account.authenticationType === AuthenticationType.aad) {
    return of(aadSilentTokenRefreshAction(action));
  }

  const errorMessageParts = [unknownErrorMessage];
  if (response.status) {
    errorMessageParts.push(`HTTP Status ${response.status}`);
  }

  const details = response.response && response.response.error ? ` ${response.response.error.code}: ${response.response.error.message}` : '';
  if (details) {
    errorMessageParts.push(details);
  }

  return of(errorAction(errorMessageParts.join('. ')));
}
