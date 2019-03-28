import { combineEpics } from 'redux-observable';
import {
    getLogsEpic,
    autoRefreshEpic
} from './Logs';

import {
    setCredentialsEpic,
    findCredentialsCandidateEpic,
    setQueryEpic,
    clearDataEpic,
    loadProfileEpic
} from './Profile';

import {
    changeThemeEpic,
    loadUISettingsEpic
} from './UI';

import {
  loadSubscriptionsEpic
} from './Profile/Account';

export const rootEpic = combineEpics(
    getLogsEpic,
    autoRefreshEpic,

    setCredentialsEpic,
    findCredentialsCandidateEpic,
    setQueryEpic,
    clearDataEpic,
    loadProfileEpic,

    loadSubscriptionsEpic,

    changeThemeEpic,
    loadUISettingsEpic
);