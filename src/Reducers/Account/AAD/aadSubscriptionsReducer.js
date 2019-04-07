import { aadAccountActionTypes } from 'Actions/Account/AAD';

export function aadSubscriptionsReducer(state, action) {
  if (action.type !== aadAccountActionTypes.AAD_SUBSCRIPTIONS_LOADED) return;

  const { subscriptions } = action.payload;
  state.account.appVaults.aad = { ...state.aad, subscriptions };

  return { ...state };
}