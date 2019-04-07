export class MockStorage {
  constructor(data) {
    this.data = data;
  }

  getItem(key) {
    return this.data[key];
  }

  setItem(key, value) {
    this.data[key] = value;
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