import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootReducer } from 'Reducers';
import { rootEpic } from 'Epics';

import ProfileRepository from 'Services/ProfileRepository';
import ApplicationInsightsClient from 'Services/ApplicationInsightsClient';
import DomUtils from 'Utils/DomUtils';
import ConsoleDoc from 'Utils/ConsoleDoc';

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    applicationInsightsClient: new ApplicationInsightsClient(),
    profileRepository: new ProfileRepository(),
    DomUtils: DomUtils,
    ConsoleDoc: ConsoleDoc
  }
});

const store = createStore(
  rootReducer,
  applyMiddleware(epicMiddleware)
);

epicMiddleware.run(rootEpic);

export default store;