import { timer } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
import { anyCredentials } from 'Modules/Account/Epics/accountUtils';
import { refreshLogsAction, searchActionTypes } from 'Modules/Search/Actions';
import { emptyAction } from 'Modules/Shared/Actions';
import { accountActionTypes } from 'Modules/Account/Actions';
import { ofType } from 'redux-observable';

const refreshTimeThreshold = 30000;

export const autoRefreshEpic = (action$, $state) =>
  action$
    .pipe(
      ofType(
        searchActionTypes.SET_AUTOREFRESH,
        searchActionTypes.SET_LOGS,
        accountActionTypes.PROFILE_LOADED,
        accountActionTypes.AUTHENTICATION_CHANGED
      ),
      filter(q => autoRefreshFilter(q, $state)),
      switchMap(q => {
        return timer(refreshTimeThreshold)
          .pipe(
            map(t => isAutoRefreshEnabled($state.value) ? refreshLogsAction() : emptyAction())
          );
      })
    );

const isAutoRefreshEnabled = (state) => state.search.autoRefresh && !state.search.loading;
const profileLoaded = (action) => action.type === accountActionTypes.PROFILE_LOADED && anyCredentials(action.payload.account);
const authenticationChanged = (action, state) => action.type === accountActionTypes.AUTHENTICATION_CHANGED && anyCredentials(state.account);

function autoRefreshFilter(action, $state) {
  if (action.type === searchActionTypes.SET_AUTOREFRESH && action.payload.enabled) {
    return true;
  }

  if (isAutoRefreshEnabled($state.value)) {
    if (action.type === searchActionTypes.SET_LOGS) {
      return true;
    } else if (profileLoaded(action)) {
      return true;
    } else if (authenticationChanged(action, $state.value)) {
      return true;
    }
  }

  return false;
}
