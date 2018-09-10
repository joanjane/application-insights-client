import { Observable } from 'rxjs/Observable';

export default class HttpClient {
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
    let requestHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (headers) {
      requestHeaders = { ...requestHeaders, ...headers };
    }

    const queryString = buildQuery(query);
    return Observable.ajax({
      url: queryString ? `${uri}?${queryString}` : uri,
      method: method,
      headers: requestHeaders,
      responseType: 'json',
      body: body
    });
  }
}

function buildQuery(query) {
  if (!query || !query.length) return null;

  return query.map(q => `${q.name}=${encodeURIComponent(q.value)}`).join('&');
}