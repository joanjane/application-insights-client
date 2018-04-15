export default class StorageRepository {
    constructor() {
        const isTest = process.env.NODE_ENV === 'test';

        this.localStorage = isTest ?
            new MockStorage(mockLocalStorage) :
            window.localStorage;

        this.sessionStorage = isTest ?
            new MockStorage(mockSessionStorage) :
            window.sessionStorage;
    }

    getSessionData(key, parseObject) {
        if (parseObject) {
            const content = this.sessionStorage.getItem(key);
            return content ? JSON.parse(content) : null;
        }
        return this.sessionStorage.getItem(key);
    }

    saveSessionData(key, value, serializeObject) {
        this.sessionStorage.setItem(key, serializeObject ? JSON.stringify(value) : value);
    }

    clearSessionData() {
        this.sessionStorage.clear();
    }

    getLocalData(key, parseObject) {
        if (parseObject) {
            const content = this.localStorage.getItem(key);
            return content ? JSON.parse(content) : null;
        }
        return this.localStorage.getItem(key);
    }

    saveLocalData(key, value, serializeObject) {
        this.localStorage.setItem(key, serializeObject ? JSON.stringify(value) : value);
    }

    clearLocalData() {
        this.localStorage.clear();
    }
}

const mockLocalStorage = {};
const mockSessionStorage = {};

class MockStorage {
    constructor(data) {
        this.data = data;
    }

    getItem(key) {
        this.data[key];
    }

    setItem(key, value) {
        return this.data[key] = value;
    }

    removeItem(key) {
        delete this.data[key];
    }

    clear() {
        Object.keys(this.data).forEach(key => {
            this.removeItem(key);
        });
    }
}