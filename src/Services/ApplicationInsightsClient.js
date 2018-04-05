export default class ApplicationInsightsClient {
    getLogs(credentials, query) {
        query = query || 'traces | limit 50';
        const uri = `https://api.applicationinsights.io/v1/apps/${credentials.appId}/query?query=${encodeURIComponent(query)}`;

        return new Promise((resolve, reject) => {
            fetch(uri, {
                method: 'GET',
                headers: {
                    'x-api-key': credentials.apiKey
                }
            }).then(response => {
                if (!response.ok) {
                    reject(response);
                    return;
                }
                response.json().then(content => {
                    resolve(this.mapQueryResponse(content));
                });
            }, error => reject(error));
        });
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

    /*

    */
}