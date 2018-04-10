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
            trace: {
                timestamp: 'timestamp',
                message: 'message',
                severityLevel: 'severityLevel',
            },
            exception: {
                timestamp: 'timestamp',
                message: 'outerMessage',
                severityLevel: 'severityLevel',
            }
        };

        const columnsIndexMap = {};
        response.tables[0].columns
            .forEach((c, i) => columnsIndexMap[c.name] = i);
        
        return response.tables[0].rows.map(row => {
            const itemType = row[columnsIndexMap['itemType']];

            var model = {};
            if (responseModel[itemType]) {
                Object.keys(responseModel[itemType]).forEach(prop => {
                    const propToMap = responseModel[itemType][prop];
                    const propIndex = columnsIndexMap[propToMap];
                    model[prop] = row[propIndex];
                });
            } else {
                return null;
            }
            return model;
        }).filter(r => r !== null);
    }
}