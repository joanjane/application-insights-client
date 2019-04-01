import AuthenticationType from 'Models/AuthenticationType';

export function anyCredentials(credentials) {
  if (credentials.authenticationType === AuthenticationType.none) {
    return false;
  } else if (credentials.authenticationType === AuthenticationType.aad) {
    return !(!credentials.aad.authenticated || !credentials.aad.subscriptionId || !credentials.aad.resourceId);
  } else if (credentials.authenticationType === AuthenticationType.apiKey) {
    return !(!credentials.api.appId || !credentials.api.apiKey);
  }
}