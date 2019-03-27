import AuthenticationType from 'Models/AuthenticationType';

export function anyCredentials(credentials) {
  return credentials.authenticationType !== AuthenticationType.apiKey;
}