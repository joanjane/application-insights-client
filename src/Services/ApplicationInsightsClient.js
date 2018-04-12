import httpClientFactory from './httpClientFactory'

export default class ApplicationInsightsClient {
    constructor() {
        this.httpClient = httpClientFactory();
    }

    getLogs(credentials, query) {
        query = query || 'traces | sort by timestamp desc | limit 50';
        const uri = `${this.buildAppUri(credentials)}/query?query=${encodeURIComponent(query)}&timespan=P7D`;

        return this.httpClient.get(uri, this.buildHeaders(credentials)).then(response => {
            const result = this.mapQueryResponse(response);
            console.log(result);
            return result;
        }, error => {
            alert('Error when getting traces, see console for details');
            console.error(error);
            if (error.json) {
                error.json().then(err => console.error(err));
            }
            return Promise.reject(error);
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

        const columnsIndexMap = this.buildColumnIndexMap(response);

        const rows = response.tables[0].rows.map(row => {
            const itemType = row[columnsIndexMap['itemType']];

            if (!responseModel[itemType]) {
                // when item type is not supported, skip
                return null;
            }

            var model = {};
            Object.keys(responseModel[itemType]).forEach(prop => {
                const propToMap = responseModel[itemType][prop];
                const propIndex = columnsIndexMap[propToMap];
                model[prop] = row[propIndex];
            });
            return model;
        })
        .filter(r => r !== null)
        .sort((a, b) => {
            if (a.timestamp === b.timestamp) {
                return 0;
            } else if (a.timestamp > b.timestamp) {
                return 1;
            } else {
                return -1;
            }
        });

        return {
            logs: rows,
            appName: this.getAppName(response, columnsIndexMap),
            fetchTime: new Date()
        };
    }

    /**
     * return a dictionary of property name and column index
     * {[columnName: string]: columnIndex: number} response 
     */
    buildColumnIndexMap(response) {
        const columnsIndexMap = {};
        response.tables[0].columns.forEach((c, i) => columnsIndexMap[c.name] = i);
        return columnsIndexMap;
    }

    getAppName(response, columnsIndexMap) {
        if (response.tables[0].rows.length < 1) {
            return null;
        }
        const appNameIndex = columnsIndexMap['appName'];
        return response.tables[0].rows[0][appNameIndex]
    }
}