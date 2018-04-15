import QueryStringUtils from '../Utils/QueryStringUtils';
import StorageRepository from './StorageRepository';

export default class ProfileRepository {
  constructor() {
    this.storageRepository = new StorageRepository();
  }

  getCredentials() {
    const queryParams = QueryStringUtils.getParams();
    if (queryParams['app_id'] && queryParams['api_key']) {
      QueryStringUtils.removeParams();
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

  storeCredentials(credentials, appName) {
    this.storageRepository.saveSessionData('credentials', credentials, true);
    this.storageRepository.saveLocalData('lruCredentials', credentials, true);
    if (appName) {
      this.storeAppCredentials(credentials, appName);
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

  clearData() {
    this.storageRepository.clearSessionData();
    this.storageRepository.clearLocalData();
  }
}