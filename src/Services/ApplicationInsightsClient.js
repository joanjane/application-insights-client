import httpClientFactory from './httpClientFactory';
import { Observable } from 'rxjs/Observable';

export default class ApplicationInsightsClient {
  constructor() {
    this.httpClient = httpClientFactory();
  }

  getLogs(credentials, query, timespan) {
    query = query || 'traces | sort by timestamp desc | limit 50';
    timespan = timespan || 'P7D';
    const uri = `${this.buildAppUri(credentials)}/query?query=${encodeURIComponent(query)}&timespan=${timespan}`;

    return this.httpClient.get(uri, this.buildHeaders(credentials)).map(httpResponse =>
      this.mapQueryResponse(httpResponse.response)
    ).catch(error => {
      console.error(error);
      return Observable.throw(error);
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

    const colIndexPropertyMap = this.buildColumnIndexPropertyMap(response);
    const rows = response.tables[0].rows.map(row => {
      const itemType = row[colIndexPropertyMap['itemType']];
      const reponseMapper = this.getResponseMapper(itemType);
      if (!reponseMapper) {
        // when item type is not supported, skip
        return null;
      }

      var model = {};
      reponseMapper.forEach(propertyMapper => propertyMapper(row, colIndexPropertyMap, model));
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
      appName: this.getAppName(response, colIndexPropertyMap),
      fetchTime: new Date()
    };
  }

  getResponseMapper(itemType) {
    return responseMapper[itemType];
  }

  /**
   * return a dictionary of property name and column index
   * {[columnName: string]: columnIndex: number} response
   */
  buildColumnIndexPropertyMap(response) {
    const columnsIndexMap = {};
    response.tables[0].columns.forEach((c, i) => columnsIndexMap[c.name] = i);
    return columnsIndexMap;
  }

  getAppName(response, columnsIndexPropertyMap) {
    if (response.tables[0].rows.length < 1) {
      return null;
    }
    const appNameIndex = columnsIndexPropertyMap['appName'];
    return response.tables[0].rows[0][appNameIndex]
  }
}

const responseMapper = {
  trace: [
    (row, columnsIndexMap, model) => {
      model.timestamp = new Date(row[columnsIndexMap['timestamp']]);
    },
    (row, columnsIndexMap, model) => {
      model.message = row[columnsIndexMap['message']];
    },
    (row, columnsIndexMap, model) => {
      model.severityLevel = row[columnsIndexMap['severityLevel']];
    }
  ],
  exception: [
    (row, columnsIndexMap, model) => {
      model.timestamp = new Date(row[columnsIndexMap['timestamp']]);
    },
    (row, columnsIndexMap, model) => {
      model.message = `${row[columnsIndexMap['problemId']]}: ${row[columnsIndexMap['outerMessage']]}`;
      if (row[columnsIndexMap['outerMessage']] !== row[columnsIndexMap['innermostMessage']]) {
        model.message += `\r\n${row[columnsIndexMap['innermostType']]}: ${row[columnsIndexMap['innermostMessage']]}.`;
      }
    },
    (row, columnsIndexMap, model) => {
      model.severityLevel = row[columnsIndexMap['severityLevel']];
    }
  ]
};