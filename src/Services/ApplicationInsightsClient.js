import httpClientFactory from './httpClientFactory'

export default class ApplicationInsightsClient {
    constructor() {
        this.httpClient = httpClientFactory();
    }

    getLogs(credentials, query) {
        query = query || 'traces | limit 50';
        const uri = `${this.buildAppUri(credentials)}/query?query=${encodeURIComponent(query)}&timespan=P7D`;

        return this.httpClient.get(uri, this.buildHeaders(credentials)).then(response => {
            return this.mapQueryResponse(response);
        });
    }

    buildAppUri(credentials) {
        return `https://api.applicationinsights.io/v1/apps/${credentials.appId}`;
    }

    buildHeaders(credentials) {
        return {
            'x-api-key': credentials.apiKey
        };
    }

    mapQueryResponse(response) {
        if (!response || !response.tables) {
            throw new Error('Unexpected response content from query');
        }
        const responseModel = {
            'timestamp': null,
            'message': null,
            'severityLevel': null,
        };
        const cols = response.tables[0].columns.filter( c => Object.keys(responseModel).some(k => k === c.name));
        const colIndexes = cols.map(col => response.tables[0].columns.indexOf(col));

        return response.tables[0].rows.map(row => {
            var model = {};
            colIndexes.forEach(colIndex => {
                model[cols[colIndex].name] = row[colIndex];
            });
            return model;
        });
    }
}