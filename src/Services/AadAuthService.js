
export default class AadAuthService {
  constructor() {
    const fragmentParams = this.parseFragmentParams();
    if (!fragmentParams) {
      return;
    }
    if (fragmentParams['error']) {
      console.error(`Error: ${fragmentParams['error']}\nDetails: ${fragmentParams['error_description']}`);
    } else if (fragmentParams['access_token']) {
      sessionStorage.setItem('access_token', fragmentParams['access_token']);
      // console.log(fragmentParams['access_token']);
    }
    document.location.hash = '';
  }

  getToken() {
    return sessionStorage.getItem('access_token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getHash() {
    return document.location.hash;
  }

  logout() {
    sessionStorage.removeItem('access_token');
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
    const tenant = sessionStorage.getItem('aad.tenant');
    const clientId = sessionStorage.getItem('aad.clientid');
    const audience = 'https://api.applicationinsights.io';
    const redirectUrl = `https://login.microsoftonline.com/${tenant}/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(document.location.origin)}&resource=${encodeURIComponent(audience)}&scopes=user_impersonation`;

    console.log(`Redirecting to ${redirectUrl}`);
    document.location.href = redirectUrl;
  }
}