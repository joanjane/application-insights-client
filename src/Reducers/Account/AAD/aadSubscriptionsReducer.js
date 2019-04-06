import { AAD_SUBSCRIPTIONS_LOADED } from 'Actions/Account/AAD';

export function aadSubscriptionsReducer(state, action) {
  if (action.type !== AAD_SUBSCRIPTIONS_LOADED) return;

  const { subscriptions } = action.payload;
  state.account.appVaults.aad = { ...state.aad, subscriptions };

  return { ...state };
}