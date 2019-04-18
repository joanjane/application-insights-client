import { combineEpics } from 'redux-observable';
import { epics as searchEpics } from 'Modules/Search/Epics/epics';
import { epics as accountEpics } from 'Modules/Account/Epics/epics';
import { epics as uiEpics } from 'Modules/UI/Epics/epics';

export const rootEpic = combineEpics(
    ...searchEpics,
    ...accountEpics,
    ...uiEpics
);