import { combineEpics } from 'redux-observable';
import { epics as searchEpics } from './Search/epics';
import { epics as accountEpics } from './Account/epics';
import { epics as uiEpics } from './UI/epics';

export const rootEpic = combineEpics(
    ...searchEpics,
    ...accountEpics,
    ...uiEpics
);