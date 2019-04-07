import { aadAccountActionTypes } from 'Actions/Account/AAD';

export function aadSubscriptionsReducer(state, action) {
  if (action.type !== aadAccountActionTypes.AAD_SUBSCRIPTIONS_LOADED) return;

  let { subscriptions } = action.payload;
  subscriptions = subscriptions.sort(sortByName);
  state.account.appVaults.aad = { ...state.aad, subscriptions };

  return { ...state };
}

function sortByName(a,b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}