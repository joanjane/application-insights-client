import httpClientFactory from './httpClientFactory';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { buildColumnPropertyIndex, getRowMapper } from './ResponseMappers';
import AadAuthService from './AadAuthService';

export default class ApplicationInsightsClient {
  constructor() {
    this.httpClient = httpClientFactory();
    this.aadAuthService = new AadAuthService();
  }

  getLogs(credentials, query, timespan) {
    const queryParams = [{ name: 'query', value: query }, { name: 'api-version', value: '2018-04-20'}];
    if (timespan) {
      queryParams.push({ name: 'timespan', value: timespan });
    }

    return this.httpClient.get(
      `${this.buildAppUri(credentials)}/query`,
      this.buildHeaders(credentials),
      queryParams
    )
    .pipe(
      map(httpResponse => this.mapQueryResponse(httpResponse.response)),
      catchError(error => {
        console.error(error.response);
        if (error.response && error.response.error) {
          const reason = this.mapError('', error.response.error);
          return throwError(reason);
        } else if (typeof (error.response) === 'string') {
          return throwError(`${error.status}: ${error.response}`);
        }
        return throwError(error);
      })
    );
  }

  mapError(message, error) {
    if (!error || !error.message) {
      return `${message}`;
    }
    return this.mapError(`${message}${error.message}. `, error.innererror);
  }

  buildAppUri(credentials) {
    return `https://api.applicationinsights.io/v1/apps/${credentials.appId}`;
  }

  buildHeaders(credentials) {
    const aadAccessToken = this.aadAuthService.getToken();
    if (aadAccessToken) {
      return {
        'Authorization': `Bearer ${aadAccessToken}`
      };
    }

    return {
      'x-api-key': credentials.apiKey
    };
  }

  mapQueryResponse(response) {
    if (!response || !response.tables) {
      throw new Error('Unexpected response content from query');
    }

    const colPropertiesIndex = buildColumnPropertyIndex(response);
    const rows = response.tables[0].rows.map(row => {
      const reponseMapper = getRowMapper(row, colPropertiesIndex);
      if (!reponseMapper) {
        // when item type is not supported, skip
        return null;
      }

      var model = reponseMapper(row, colPropertiesIndex);
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
      appName: this.getAppName(response, colPropertiesIndex),
      fetchTime: new Date()
    };
  }

  getAppName(response, columnsIndexPropertyMap) {
    if (response.tables[0].rows.length < 1) {
      return null;
    }
    const appNameIndex = columnsIndexPropertyMap['appName'];
    return response.tables[0].rows[0][appNameIndex]
  }
}