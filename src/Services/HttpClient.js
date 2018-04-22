import { Observable } from 'rxjs';

export default class HttpClient {
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
        const requestHeaders = {
            ...headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        return Observable.ajax({
            url: uri,
            method: method,
            headers: requestHeaders,
            responseType: 'json',
            body: body
        });
    }
}