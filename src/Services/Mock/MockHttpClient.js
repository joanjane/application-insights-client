import HttpMock from './HttpMock';

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
        return new Promise((resolve, reject) => {
            if (HttpMock[uri]) {
                resolve(HttpMock[uri]);
            } else {
                reject(`uri ${uri} not added to mock`);
            }
        });
    }
}