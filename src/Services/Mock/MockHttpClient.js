import HttpMock from './HttpMock';
import { Observable } from 'rxjs';

export default class MockHttpClient {
  get(uri, headers, query) {
    return this.request('GET', uri, headers, query);
  }

  post(uri, body, headers, query) {
    return this.request('POST', uri, headers, query, body);
  }

  put(uri, body, headers, query) {
    return this.request('PUT', uri, headers, query, body);
  }

  delete(uri, headers, query) {
    return this.request('DELETE', uri, headers, query);
  }

  request(method, uri, headers, query, body) {
    const queryString = buildQuery(query);
    const url = queryString ? `${uri}?${queryString}` : uri;

    console.debug(`MOCK [${method}] ${url}`);
    return Observable.create(observer => {
      setTimeout(() => {
        if (HttpMock[url]) {
          observer.next(HttpMock[url]);
        } else {
          observer.error({
            status: 404,
            response: `Mock not found ${url}`
          });
        }
        observer.complete();
      }, 1500);
    });
  }
}

function buildQuery(query) {
  if (!query || !query.length) return null;

  return query.map(q => `${q.name}=${encodeURIComponent(q.value)}`).join('&');
}