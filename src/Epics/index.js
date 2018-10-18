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
} from './UI'

export const rootEpic = combineEpics(
    getLogsEpic,
    autoRefreshEpic,
    
    setCredentialsEpic,
    findCredentialsCandidateEpic,
    setQueryEpic,
    clearDataEpic,
    loadProfileEpic,

    changeThemeEpic,
    loadUISettingsEpic
);