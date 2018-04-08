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
        return new Promise((resolve, reject) => {
            fetch(uri, {
                method,
                headers,
                body,
            }).then(response => {
                if (!response.ok) {
                    reject(response);
                    return;
                }
                response.json().then(content => {
                    resolve(content);
                }, (error) => reject(error));
            }, error => reject(error));
        });
    }
}