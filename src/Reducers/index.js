import { combineActiveReducers } from './combineActiveReducers';
import { initialState } from './initialState';
import { reducers as searchReducers } from './Search/reducers';
import { reducers as accountReducers } from './Account/reducers';
import { reducers as uiReducers } from './UI/reducers';
import { errorReducer } from './errorReducer';

export const rootReducer = combineActiveReducers([
  ...searchReducers,
  ...accountReducers,
  ...uiReducers,
  errorReducer
], initialState());