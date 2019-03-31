export class AadAuthService {
  constructor(storageRepository) {
    this.storageRepository = storageRepository;
    this.clientId = process.env.REACT_APP_CLIENT_ID;
    this.scopes = [
      'openid',
      'profile',
      'https://management.azure.com/user_impersonation',
      // 'https://api5.applicationinsights.io/Data.Read' //AAD Gives an error  (AADSTS28000) if more than 1 scope. Really MSFT!?
    ];

    this.checkResponseCallback();
  }

  checkResponseCallback() {
    const fragmentParams = this.parseFragmentParams();
    if (!fragmentParams) return;

    if (fragmentParams['error']) {
      const err = `Error: ${fragmentParams['error']}\nDetails: ${fragmentParams['error_description']}`;
      alert(err);
      this.setHash('');
    } else if (fragmentParams['access_token']) {
      this.storageRepository.saveSessionData('access_token', fragmentParams['access_token']);
      this.setHash('');
    }
  }

  getToken() {
    return this.storageRepository.getSessionData('access_token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getHash() {
    return document.location.hash;
  }

  setHash(hash) {
    return document.location.hash = hash;
  }

  logout() {
    this.storageRepository.removeSessionData('access_token');
    window.location.reload();
  }

  parseFragmentParams() {
    if (this.getHash() === '') {
      return null;
    }
    const params = this.getHash().substring(1).split('&')
      .map(p => {
        const prop = p.split('=');
        return {
          key: prop[0],
          value: decodeURIComponent(prop[1].replace(/\+/g, '%20'))
        }
      }).reduce((prev, current) => {
        prev[current.key] = current.value;
        return prev;
      }, {});

    return params;
  }

  redirectToSso() {
    const queryParams = [
      { key: 'client_id', value: this.clientId },
      { key: 'response_type', value: 'token' },
      { key: 'redirect_uri', value: document.location.origin },
      { key: 'scope', value: this.scopes.join(' ') },
    ];
    let tenant = 'common';
    let redirectUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?${this.formatQuery(queryParams)}`;
    document.location.href = redirectUrl;
  }

  formatQuery(queryParams) {
    const query = queryParams.map(q => `${q.key}=${encodeURIComponent(q.value)}`).join('&');
    return query;
  }
}