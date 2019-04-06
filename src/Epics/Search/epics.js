import {
  autoRefreshEpic,
  getLogsEpic,
  setQueryEpic,
  setSearchPeriodEpic
} from '.';

export const epics = [
  autoRefreshEpic,
  getLogsEpic,
  setQueryEpic,
  setSearchPeriodEpic
];