import { DomUtils } from 'Utils/DomUtils';
import { ConsoleDoc } from 'Utils/ConsoleDoc';
import { QueryStringUtils } from 'Utils/QueryStringUtils';
import { DateUtils } from 'Utils/DateUtils';
import { ProfileRepository } from 'Services/ProfileRepository';
import { StorageRepository, MockStorage } from 'Services/StorageRepository';
import { ApplicationInsightsClient } from 'Services/ApplicationInsightsClient';
import { HttpClient } from 'Services/HttpClient';
import { AadAuthService } from 'Services/AadAuthService';

const isTest = process.env.NODE_ENV === 'test';

const dependencies = {
  ApplicationInsightsClient: (c) => new ApplicationInsightsClient(
    c('HttpClient'),
    c('AadAuthService')
  ),
  ProfileRepository: (c) => new ProfileRepository(c('StorageRepository'), c('QueryStringUtils')),
  DomUtils: () => new DomUtils(),
  ConsoleDoc: () => new ConsoleDoc(),
  QueryStringUtils: () => new QueryStringUtils(),
  DateUtils: () => new DateUtils(),
  HttpClient: () => new HttpClient(),
  AadAuthService: (c) => new AadAuthService(c('StorageRepository')),
  StorageRepository: () => {
    const localStorage = isTest ?
      new MockStorage({}) :
      window.localStorage;

    const sessionStorage = isTest ?
      new MockStorage({}) :
      window.sessionStorage;
    return new StorageRepository(localStorage, sessionStorage);
  }
};

export function inject(name) {
  const dependencyFactory = dependencies[name];
  if (!dependencyFactory) {
    throw new Error(`${name} is not registered`);
  }
  return dependencyFactory(inject);
}