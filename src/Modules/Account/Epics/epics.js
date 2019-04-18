import {
  clearDataEpic,
  loadProfileEpic,
  setAuthenticationTypeEpic
} from '.';

import {
  loadSubscriptionsEpic,
  loadSubscriptionsAppsEpic,
  aadLoginEpic,
  aadLogoutEpic,
  aadSilentTokenRefreshEpic,
  setAADSubscriptionEpic,
  loadTenantsEpic
} from './AAD';

import {
  findApiKeyCredentialsCandidateEpic,
  setApiKeyCredentialsEpic
} from './ApiKey';

export const epics = [
  clearDataEpic,
  loadProfileEpic,
  setAuthenticationTypeEpic,

  loadSubscriptionsEpic,
  loadSubscriptionsAppsEpic,
  aadLoginEpic,
  aadLogoutEpic,
  aadSilentTokenRefreshEpic,
  setAADSubscriptionEpic,
  loadTenantsEpic,

  findApiKeyCredentialsCandidateEpic,
  setApiKeyCredentialsEpic
];