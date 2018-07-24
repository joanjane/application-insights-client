import HttpMock from './HttpMock';
import { Observable } from 'rxjs/Observable';

export default class MockHttpClient {
  get(uri, headers) {
    return this.request('GET', uri, headers);
  }

  post(uri, body, headers) {
    return this.request('POST', uri, headers, body);
  }

  put(uri, body, headers) {
    return this.request('PUT', uri, headers);
  }

  delete(uri, headers) {
    return this.request('DELETE', uri, headers);
  }

  request(method, uri, headers, body) {
    console.debug(`MOCK [${method}] ${uri}`);
    return Observable.create(observer => {
      setTimeout(() => {
        if (HttpMock[uri]) {
          observer.next(HttpMock[uri]);
        } else {
          observer.error({
            status: 404,
            response: 'Not found'
          });
        }
        observer.complete();
      }, 1500);
    });
  }
}