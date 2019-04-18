import { combineActiveReducers } from './combineActiveReducers';
import { initialState } from './initialState';
import { reducers as searchReducers } from 'Modules/Search/Reducers/reducers';
import { reducers as accountReducers } from 'Modules/Account/Reducers/reducers';
import { reducers as uiReducers } from 'Modules/UI/Reducers/reducers';
import { reducers as sharedReducers } from 'Modules/Shared/Reducers/reducers';

export const rootReducer = combineActiveReducers([
  ...searchReducers,
  ...accountReducers,
  ...uiReducers,
  ...sharedReducers
], initialState());