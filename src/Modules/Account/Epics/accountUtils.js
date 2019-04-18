import { AuthenticationType } from 'Modules/Account/Models';

export function anyCredentials(account) {
  if (account.authenticationType === AuthenticationType.none) {
    return false;
  } else if (account.authenticationType === AuthenticationType.aad) {
    return !(!account.aad.authenticated || !account.aad.subscriptionId || !account.aad.resourceId);
  } else if (account.authenticationType === AuthenticationType.apiKey) {
    return !(!account.apiKey.appId || !account.apiKey.apiKey);
  }
}