export default class ProfileRepository {
  getCredentials() {
    const storedCredentials = sessionStorage.getItem('credentials');

    if (storedCredentials) {
      return JSON.parse(storedCredentials);
    } else {
      const credentialsByApp = this.getAllCredentials();
      if (!credentialsByApp) {
        return null;
      }
      const apps = Object.keys(credentialsByApp);
      if (apps.length === 0) {
        return null;
      }
      return credentialsByApp[apps[0]];
    }
  }

  storeCredentials(credentials, appName) {
    sessionStorage.setItem('credentials', JSON.stringify(credentials));
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
    return credentialsByApp[appName];
  }
}