import QueryStringUtils from '../Utils/QueryStringUtils';

export default class ProfileRepository {
  getCredentials() {
    const queryParams = QueryStringUtils.getParams();
    if (queryParams['app_id'] && queryParams['api_key']) {
      QueryStringUtils.removeParams();
      return {
        appId: queryParams['app_id'],
        apiKey: queryParams['api_key'],
      };
    }

    const storedCredentials = sessionStorage.getItem('credentials');
    if (storedCredentials) {
      return JSON.parse(storedCredentials);
    } else {
      const lastUsedCredentials = localStorage.getItem('lruCredentials');
      return lastUsedCredentials ?
        JSON.parse(lastUsedCredentials) :
        null;
    }
  }

  storeCredentials(credentials, appName) {
    sessionStorage.setItem('credentials', JSON.stringify(credentials));
    localStorage.setItem('lruCredentials', JSON.stringify(credentials));
    if (appName) {
      this.storeAppCredentials(credentials, appName);
    }
  }

  getQuery() {
    return sessionStorage.getItem('query');
  }

  storeQuery(query) {
    sessionStorage.setItem('query', query);
  }

  storeAppCredentials(credentials, appName) {
    if (!appName || !credentials.appId || !credentials.apiKey ||
      credentials.appId === appName) {
      return;
    }

    const credentialsByAppContent = localStorage.getItem('credentialsByApp');
    const credentialsByApp = credentialsByAppContent ? JSON.parse(credentialsByAppContent) : {};
    credentialsByApp[appName] = credentials;
    localStorage.setItem('credentialsByApp', JSON.stringify(credentialsByApp));
  }

  getAllCredentials() {
    const credentialsByAppContent = localStorage.getItem('credentialsByApp');
    if (!credentialsByAppContent) {
      return null;
    }
    return JSON.parse(credentialsByAppContent);
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

  
}