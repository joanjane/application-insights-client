import AuthenticationType from 'Models/AuthenticationType';

export class ProfileRepository {
  constructor(storageRepository, queryStringUtils) {
    this.storageRepository = storageRepository;
    this.queryStringUtils = queryStringUtils;
  }

  getCredentials() {
    const queryCredentials = this.getCredentialsFromQuery();
    if (queryCredentials) {
      return queryCredentials;
    }

    const storedCredentials = this.storageRepository.getSessionData('credentials', true);
    if (storedCredentials) {
      return ensureCredentialsV2Model(storedCredentials);
    } else {
      const lastUsedCredentials = this.storageRepository.getLocalData('lruCredentials', true);
      if (lastUsedCredentials) {
        return ensureCredentialsV2Model(storedCredentials);
      }
    }

    return ensureCredentialsV2Model();
  }

  storeCredentials(credentials) {
    this.storageRepository.saveSessionData('credentials', credentials, true);
    this.storageRepository.saveLocalData('lruCredentials', credentials, true);
    if (credentials.authenticationType === AuthenticationType.apiKey && credentials.appName) {
      this.storeAppCredentials(credentials, credentials.appName);
    }
  }

  getQuery() {
    return this.storageRepository.getSessionData('query');
  }

  storeQuery(query) {
    this.storageRepository.saveSessionData('query', query);
  }

  storeAppCredentials(credentials, appName) {
    if (!appName || !credentials.appId || !credentials.apiKey || credentials.appId === appName) {
      return;
    }

    const credentialsByApp = this.getAllCredentials() || {};
    credentialsByApp[appName] = credentials;
    this.storageRepository.saveLocalData('credentialsByApp', credentialsByApp, true);
  }

  getAllCredentials() {
    return this.storageRepository.getLocalData('credentialsByApp', true);
  }

  getStoredAppNamesCredentials() {
    const credentialsByApp = this.getAllCredentials();
    if (!credentialsByApp) {
      return [];
    }
    const apps = Object.keys(credentialsByApp);
    return apps;
  }

  findCredentialsCanditate(appName) {
    const credentialsByApp = this.getAllCredentials();
    if (!credentialsByApp) {
      return null;
    }
    return ensureCredentialsV2Model({
      authenticationType: AuthenticationType.apiKey,
      api: credentialsByApp[appName]
    });
  }

  getUITheme() {
    return this.storageRepository.getLocalData('ui-theme');
  }

  setUITheme(theme) {
    this.storageRepository.saveLocalData('ui-theme', theme);
  }

  getCredentialsFromQuery() {
    const queryParams = this.queryStringUtils.getParams();
    if (queryParams['app_id'] && queryParams['api_key']) {
      this.queryStringUtils.removeParams();
      return ensureCredentialsV2Model({
        authenticationType: AuthenticationType.apiKey,
        api: {
          appId: queryParams['app_id'],
          apiKey: queryParams['api_key'],
        }
      });
    }
    return null;
  }

  clearData() {
    this.storageRepository.clearSessionData();
    this.storageRepository.clearLocalData();
  }
}

function ensureCredentialsV2Model(credentials) {
  credentials = credentials || {};
  const appId = credentials.appId || '';
  const apiKey = credentials.apiKey || '';
  let authenticationType = credentials.authenticationType ? credentials.authenticationType : AuthenticationType.none;
  if (appId && apiKey) {
    authenticationType = AuthenticationType.apiKey;
  }
  return {
    authenticationType,
    api: credentials.api ?
      credentials.api :
      {
        appId,
        apiKey,
      },
    aad: credentials.aad ?
      credentials.aad :
      {
        subscriptionId: '',
        resourceId: '',
        appId: '',
        authenticated: false
      }
  };
}