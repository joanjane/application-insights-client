export class StorageRepository {
  constructor(localStorage, sessionStorage) {
    this.localStorage = localStorage;
    this.sessionStorage = sessionStorage;
  }

  getSessionData(key, parseObject) {
    if (parseObject) {
      const content = this.sessionStorage.getItem(key);
      try {
        return content ? JSON.parse(content) : null;
      } catch (e) {
        return null;
      }
    }
    return this.sessionStorage.getItem(key);
  }

  saveSessionData(key, value, serializeObject) {
    this.sessionStorage.setItem(key, serializeObject ? JSON.stringify(value) : value);
  }

  removeSessionData(key) {
    this.sessionStorage.removeItem(key);
  }

  clearSessionData() {
    this.sessionStorage.clear();
  }

  getLocalData(key, parseObject) {
    if (parseObject) {
      const content = this.localStorage.getItem(key);
      try {
        return content ? JSON.parse(content) : null;
      } catch (e) {
        return null;
      }
    }
    return this.localStorage.getItem(key);
  }

  saveLocalData(key, value, serializeObject) {
    this.localStorage.setItem(key, serializeObject ? JSON.stringify(value) : value);
  }

  removeLocalData(key) {
    this.localStorage.removeItem(key);
  }

  clearLocalData() {
    this.localStorage.clear();
  }
}