import { AuthenticationType } from 'Modules/Account/Models';

export class ProfileRepository {
  constructor(storageRepository, queryStringUtils) {
    this.storageRepository = storageRepository;
    this.queryStringUtils = queryStringUtils;
  }

  getAuthenticationType() {
    return this.getLruData(selectors.authenticationType, true);
  }

  setAuthenticationType(authenticationType) {
    this.setLruData(selectors.authenticationType, authenticationType, true);
  }

  getAADAccount() {
    return this.getLruData(selectors.aadAccount, true);
  }

  setAADAccount(aadAccount) {
    this.setLruData(selectors.aadAccount, aadAccount, true);
  }

  getApiKeyAccount() {
    const queryCredentials = this.getApiKeyCredentialsFromQuery();
    if (queryCredentials) {
      return queryCredentials;
    }
    return this.getLruData(selectors.apiKeyAccount, true);
  }

  setApiKeyAccount(apiKeyAccount) {
    this.setLruData(selectors.apiKeyAccount, apiKeyAccount, true);
    if (apiKeyAccount.appName) {
      this.storeAppCredentials(apiKeyAccount, apiKeyAccount.appName);
    }
  }

  getQuery() {
    return this.storageRepository.getSessionData(selectors.query);
  }

  storeQuery(query) {
    this.storageRepository.saveSessionData(selectors.query, query);
  }

  getSearchPeriod() {
    return this.storageRepository.getSessionData(selectors.searchPeriod);
  }

  storeSearchPeriod(searchPeriod) {
    this.storageRepository.saveSessionData(selectors.searchPeriod, searchPeriod);
  }

  storeAppCredentials(apiKeyCredentials, appName) {
    if (!appName || !apiKeyCredentials.appId || !apiKeyCredentials.apiKey || apiKeyCredentials.appId === appName) {
      return;
    }

    const apiKeyAccounts = (this.getAllApiKeyAccounts() || []).filter(c => c.appId !== apiKeyCredentials.appId);
    apiKeyAccounts.push(apiKeyCredentials);
    this.storageRepository.saveLocalData(selectors.apiKeyApps, apiKeyAccounts, true);
  }

  getAllApiKeyAccounts() {
    return this.storageRepository.getLocalData(selectors.apiKeyApps, true);
  }

  getUITheme() {
    return this.storageRepository.getLocalData(selectors.uiTheme);
  }

  setUITheme(theme) {
    this.storageRepository.saveLocalData(selectors.uiTheme, theme);
  }

  getApiKeyCredentialsFromQuery() {
    const queryParams = this.queryStringUtils.getParams();
    if (queryParams['app_id'] && queryParams['api_key']) {
      this.queryStringUtils.removeParams();
      this.setAuthenticationType(AuthenticationType.apiKey);
      return {
        appId: queryParams['app_id'],
        apiKey: queryParams['api_key'],
      };
    }
    return null;
  }

  clearData() {
    this.storageRepository.clearSessionData();
    this.storageRepository.clearLocalData();
  }

  getLruData(key, parseObject) {
    let data = this.storageRepository.getSessionData(key, parseObject);
    if (data == null) {
      data = this.storageRepository.getLocalData(`lru.${key}`, parseObject);
    }

    return data;
  }

  setLruData(key, value, serializeObject) {
    let data = this.storageRepository.saveSessionData(key, value, serializeObject);
    if (data == null) {
      data = this.storageRepository.saveLocalData(`lru.${key}`, value, serializeObject);
    }

    return data;
  }

  runMigrations() {
    try {
      this.migrateV2Model();
    } catch (e) {
      console.error('Error running migrations', e);
    }
  }

  migrateV2Model() {
    // Migrate theme
    const oldTheme = this.storageRepository.getLocalData('ui-theme');
    if (oldTheme) {
      this.setUITheme(oldTheme);
      this.storageRepository.removeLocalData('ui-theme');
    }

    // Migrate api key app credentials
    const credentialsByApp = this.storageRepository.getLocalData('credentialsByApp', true);
    if (credentialsByApp) {
      const apps = Object.keys(credentialsByApp).map(k => credentialsByApp[k]);
      this.storageRepository.saveLocalData(selectors.apiKeyApps, apps, true);
      this.storageRepository.removeLocalData('credentialsByApp');
    }

    // Migrate credentials
    const lruCredentials = this.storageRepository.getLocalData('lruCredentials', true);
    if (lruCredentials) {
      if (lruCredentials.api) {
        this.setApiKeyAccount(lruCredentials.api);
      }

      if (lruCredentials.aad) {
        this.setAADAccount(lruCredentials.aad);
      }

      if (lruCredentials.authenticationType) {
        this.setAuthenticationType(lruCredentials.authenticationType);
      }
      this.storageRepository.removeLocalData('lruCredentials');
    }
  }
}

const selectors = {
  query: 'search.query',
  searchPeriod: 'search.searchPeriod',
  apiKeyApps: 'account.appVaults.apiKey.availableApps',
  authenticationType: 'account.authenticationType',
  aadAccount: 'account.aad',
  apiKeyAccount: 'account.apiKey',
  uiTheme: 'ui.theme'
};