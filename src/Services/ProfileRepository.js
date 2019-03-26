export class ProfileRepository {
  constructor(storageRepository, queryStringUtils) {
    this.storageRepository = storageRepository;
    this.queryStringUtils = queryStringUtils;
  }

  getCredentials() {
    const queryParams = this.queryStringUtils.getParams();
    if (queryParams['app_id'] && queryParams['api_key']) {
      this.queryStringUtils.removeParams();
      return {
        appId: queryParams['app_id'],
        apiKey: queryParams['api_key'],
      };
    }

    const storedCredentials = this.storageRepository.getSessionData('credentials', true);
    if (storedCredentials) {
      return storedCredentials;
    } else {
      const lastUsedCredentials = this.storageRepository.getLocalData('lruCredentials', true);
      return lastUsedCredentials;
    }
  }

  storeCredentials(credentials) {
    this.storageRepository.saveSessionData('credentials', credentials, true);
    this.storageRepository.saveLocalData('lruCredentials', credentials, true);
    if (credentials.appName) {
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
    if (!appName || !credentials.appId || !credentials.apiKey ||
      credentials.appId === appName) {
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
    return credentialsByApp[appName];
  }

  getUITheme() {
    return this.storageRepository.getLocalData('ui-theme');
  }

  setUITheme(theme) {
    this.storageRepository.saveLocalData('ui-theme', theme);
  }

  clearData() {
    this.storageRepository.clearSessionData();
    this.storageRepository.clearLocalData();
  }
}