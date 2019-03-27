import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { buildColumnPropertyIndex, getRowMapper, toCamelCase } from './ResponseMappers';
import AuthenticationType from 'Models/AuthenticationType';

export class ApplicationInsightsClient {
  constructor(httpClient, aadAuthService) {
    this.httpClient = httpClient;
    this.aadAuthService = aadAuthService;
  }

  getLogs(credentials, query, timespan) {
    const queryParams = [{ name: 'query', value: query }, { name: 'api-version', value: '2018-05-01-preview' }];
    if (timespan) {
      queryParams.push({ name: 'timespan', value: timespan });
    }
    try {
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

    } catch (e) {
      return throwError(e);
    }
  }

  mapError(message, error) {
    if (!error || !error.message) {
      return `${message}`;
    }
    return this.mapError(`${message}${error.message}. `, error.innererror);
  }

  buildAppUri(credentials) {
    if (credentials.authenticationType === AuthenticationType.aad) {
      return `https://management.azure.com/${credentials.aad.resourceId}/api`;
    } else if (credentials.authenticationType === AuthenticationType.aad) {
      return `https://api.applicationinsights.io/v1/apps/${credentials.api.appId}`;
    }
    throw new Error('You must setup an authentication to fetch logs');
  }

  buildHeaders(credentials) {
    if (credentials.authenticationType === AuthenticationType.aad) {
      const aadAccessToken = this.aadAuthService.getToken();
      return {
        'Authorization': `Bearer ${aadAccessToken}`
      };
    }

    return {
      'x-api-key': credentials.api.apiKey
    };
  }

  mapQueryResponse(response) {
    response = toCamelCase(response);
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

  listAppInsightsAccounts(subscriptionId) {
    const queryParams = [{ name: 'api-version', value: '2015-05-01' }];
    let uri = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Insights/components`;

    return this.httpClient.get(uri, this.buildHeaders(null), queryParams)
      .pipe(map(r => r.response.value.map(resource => {
        return { id: resource.id, name: resource.name };
      })));
  }
}