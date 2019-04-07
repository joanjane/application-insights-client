import {
  autoRefreshEpic,
  getLogsEpic,
  loadingEpic,
  setQueryEpic,
  setSearchPeriodEpic
} from '.';

export const epics = [
  autoRefreshEpic,
  getLogsEpic,
  loadingEpic,
  setQueryEpic,
  setSearchPeriodEpic
];