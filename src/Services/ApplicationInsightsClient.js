import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { buildColumnPropertyIndex, getRowMapper, toCamelCase } from './ResponseMappers';
import { AuthenticationType } from 'Modules/Account/Models';

export class ApplicationInsightsClient {
  constructor(httpClient, aadAuthService) {
    this.httpClient = httpClient;
    this.aadAuthService = aadAuthService;
  }

  getLogs(account, query, timespan) {
    const queryParams = [{ name: 'query', value: query }, { name: 'api-version', value: '2018-05-01-preview' }];
    if (timespan) {
      queryParams.push({ name: 'timespan', value: timespan });
    }
    try {
      return this.httpClient.get(
        `${this.buildAppUri(account)}/query`,
        this.buildHeaders(account),
        queryParams
      )
        .pipe(
          map(httpResponse => this.mapQueryResponse(httpResponse.response)),
          catchError(error => {
            console.error(error.response);
            if (error.status === 401) {
              return throwError(error);
            } else if (error.response && error.response.error) {
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

  buildAppUri(account) {
    if (account.authenticationType === AuthenticationType.aad) {
      return `https://management.azure.com/${account.aad.resourceId}/api`;
    } else if (account.authenticationType === AuthenticationType.apiKey) {
      return `https://api.applicationinsights.io/v1/apps/${account.apiKey.appId}`;
    }
    throw new Error('You must setup an authentication to fetch logs');
  }

  buildHeaders(account) {
    if (account.authenticationType === AuthenticationType.none) {
      throw new Error('You must setup an authentication');
    }

    if (account.authenticationType === AuthenticationType.aad) {
      return this.buildAadAuthorizationHeaders();
    }

    return {
      'x-api-key': account.apiKey.apiKey
    };
  }

  buildAadAuthorizationHeaders() {
    if (!this.aadAuthService.isAuthenticated()) {
      throw new Error('You must be authenticated to your Azure Active Directory tenant');
    }

    const aadAccessToken = this.aadAuthService.getToken();
    return {
      'Authorization': `Bearer ${aadAccessToken}`
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

    return this.httpClient.get(uri, this.buildAadAuthorizationHeaders(), queryParams)
      .pipe(map(r => r.response.value.map(resource => {
        return {
          id: resource.id,
          name: resource.name,
          appId: resource.properties.AppId
        };
      })));
  }

  listSubscriptions() {
    const queryParams = [{ name: 'api-version', value: '2015-05-01' }];
    const uri = `https://management.azure.com/subscriptions`;

    return this.httpClient.get(uri, this.buildAadAuthorizationHeaders(), queryParams)
      .pipe(map(r => r.response.value.map(resource => {
        return {
          id: resource.subscriptionId,
          name: resource.displayName
        };
      })));
  }

  listTenants() {
    const queryParams = [{ name: 'api-version', value: '2016-06-01' }];
    const uri = `https://management.azure.com/tenants`;

    const tenants = this.httpClient.get(uri, this.buildAadAuthorizationHeaders(), queryParams)
      .pipe(
        map(r => [
          { id: 'organizations', name: 'organizations (default)' },
          ...r.response.value.map(resource => {
            return {
              id: resource.tenantId,
              name: resource.tenantId
            };
          })
        ])
      );

    return tenants;
  }
}