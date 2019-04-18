import { fromEvent } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import jwtDecode from 'jwt-decode';

export class AadAuthService {
  constructor(storageRepository) {
    this.storageRepository = storageRepository;
    this.clientId = process.env.REACT_APP_CLIENT_ID;
    this.scopes = [
      'openid',
      'profile',
      'https://management.azure.com/user_impersonation',
      // 'https://api5.applicationinsights.io/Data.Read' // AAD Gives an error (AADSTS28000) if more than 1 scope. Really MSFT!?
    ];
    this.iframeName = 'aad-silent-refresh';
    this.refreshingToken = false;
    this.tokenSubject = new Subject();

    this.checkResponseCallback();
  }

  checkResponseCallback() {
    const fragmentParams = this.parseFragmentParams();
    if (!fragmentParams) return;

    if (fragmentParams['error']) {
      const err = `Error: ${fragmentParams['error']}\nDetails: ${fragmentParams['error_description']}`;
      this.storageRepository.removeSessionData('access_token');
      alert(err);
      this.setHash('');
    } else if (fragmentParams['access_token']) {
      this.storageRepository.saveSessionData('access_token', fragmentParams['access_token']);
      this.setHash('');
    }
  }

  logout() {
    this.storageRepository.removeSessionData('access_token');
  }

  silentTokenRefresh(tenantId) {
    tenantId = tenantId || 'common';

    if (this.refreshingToken) {
      console.warn('Refresh token silent is already in progress');
      return this.tokenSubject;
    }
    this.refreshingToken = true;
    this.createIFrameIfNotExists();

    const redirectUrl = this.buildLoginUrl(tenantId, 'none');
    setTimeout(() => window.open(redirectUrl, this.iframeName), 1000);
    return fromEvent(window, 'message')
      .pipe(
        filter(event => {
          if (event.origin !== window.origin) {
            return false;
          }

          let message = null;
          try {
            message = JSON.parse(event.data);
          } catch { }
          return message && (
            message.type === messageTypes.refresh_token_success ||
            message.type === messageTypes.refresh_token_error
          );
        }),
        map(e => JSON.parse(e.data)),
        map(message => {
          if (message.type === messageTypes.refresh_token_success) {
            this.storageRepository.saveSessionData('access_token', message.accessToken);
          } else {
            this.storageRepository.removeSessionData('access_token');
            this.storageRepository.saveSessionData('aad.error', message.errorMessage);
          }

          this.refreshingToken = false;
          document.querySelector(`#${this.iframeName}`).remove();
          return {
            success: message.type === messageTypes.refresh_token_success,
            errorMessage: message.errorMessage ? message.errorMessage : null
          };
        }),
        take(1),
        tap(message => this.tokenSubject.next(message)),
      );
  }

  createIFrameIfNotExists() {
    if (!document.querySelector(`#${this.iframeName}`)) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('id', this.iframeName);
      iframe.setAttribute('name', this.iframeName);
      iframe.setAttribute('hidden', 'true');
      document.body.appendChild(iframe);
    }
  }

  loginRedirect(tenantId) {
    tenantId = tenantId || 'common';
    const redirectUrl = this.buildLoginUrl(tenantId);
    document.location.href = redirectUrl;
  }

  getToken() {
    return this.storageRepository.getSessionData('access_token');
  }

  isAuthenticated() {
    const parsedToken = this.parseToken();
    if (!parsedToken) {
      return false;
    }

    return !parsedToken.isExpired()
  }

  getHash() {
    return document.location.hash;
  }

  setHash(hash) {
    return document.location.hash = hash;
  }

  postMessageToParent(message) {
    window.parent.postMessage(JSON.stringify(message), '*');
  }

  buildLoginUrl(tenantId, prompt) {
    let redirectUri = `${document.location.origin}${document.location.pathname}`;
    if (!prompt) {
      prompt = 'select_account';
    } else if (prompt === 'none') {
      redirectUri = `${document.location.origin}${document.location.pathname}aadrefreshtokensilent.html`
    }
    const queryParams = [
      { name: 'client_id', value: this.clientId },
      { name: 'response_type', value: 'token' },
      { name: 'redirect_uri', value: redirectUri },
      { name: 'scope', value: this.scopes.join(' ') },
      { name: 'prompt', value: prompt },
    ];
    const redirectUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${this.formatQuery(queryParams)}`;
    return redirectUrl;
  }

  parseFragmentParams() {
    if (this.getHash() === '') {
      return null;
    }
    const params = this.getHash().substring(1).split('&')
      .map(p => {
        const prop = p.split('=');
        return {
          name: prop[0],
          value: decodeURIComponent(prop[1].replace(/\+/g, '%20'))
        }
      }).reduce((prev, current) => {
        prev[current.name] = current.value;
        return prev;
      }, {});

    return params;
  }

  formatQuery(queryParams) {
    const query = queryParams.map(q => `${q.name}=${encodeURIComponent(q.value)}`).join('&');
    return query;
  }

  parseToken() {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const parsedToken = jwtDecode(token);
    parsedToken.expirationDate = new Date(0);
    parsedToken.expirationDate.setUTCSeconds(parsedToken.exp);
    parsedToken.isExpired = function () {
      const isExpired = this.expirationDate < new Date();
      return isExpired;
    };
    return parsedToken;
  }
}

const messageTypes = {
  refresh_token_success: 'refresh_token_success',
  refresh_token_error: 'refresh_token_error',
};