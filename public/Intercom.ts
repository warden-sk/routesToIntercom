import report from '../../helpers/report';
import type { Account } from '../../server/storages/AccountStorage';
import type { Category } from '../../server/storages/CategoryStorage';
import type { TransformedApplication } from '../../server/transformers/transformApplication';
import type { TransformedApplicationVersion } from '../../server/transformers/transformApplicationVersion';
class Intercom {
  async accountApplicationRoute(accountId: string): Promise<TransformedApplication[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/account/:accountId/application', 'GET', { accountId });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async accountFriendRoute(accountId: string): Promise<Account[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/account/:accountId/friend', 'GET', { accountId });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async accountRoute(accountId?: string): Promise<Account | Account[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/account/:accountId?', 'GET', { accountId });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async applicationRoute(applicationId?: string): Promise<TransformedApplication | TransformedApplication[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/application/:applicationId?', 'GET', { applicationId });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async applicationSubscribeRoute(applicationVersionId: string): Promise<void> {
    const request = this.#getRequest('https://leopold-server.warden.sk/application/:applicationVersionId/subscribe', 'GET', { applicationVersionId });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async applicationUnsubscribeRoute(applicationVersionId: string): Promise<void> {
    const request = this.#getRequest('https://leopold-server.warden.sk/application/:applicationVersionId/unsubscribe', 'GET', { applicationVersionId });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async applicationVersionRoute(applicationId: string): Promise<TransformedApplicationVersion[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/application/:applicationId/version', 'GET', { applicationId });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async signInRoute(body?: string, method: 'POST' = 'POST'): Promise<Account> {
    const request = this.#getRequest('https://leopold-server.warden.sk/sign-in', method, {  }, body);
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async signOutRoute(): Promise<void> {
    const request = this.#getRequest('https://leopold-server.warden.sk/sign-out', 'GET', {  });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async categoryRoute(): Promise<Category[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/category', 'GET', {  });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async meFriendRequestRoute(id?: string, body?: string, method: 'DELETE' | 'GET' | 'POST' = 'POST'): Promise<void> {
    const request = this.#getRequest('https://leopold-server.warden.sk/me/friend/request/:id?', method, { id }, body);
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async meFriendRoute(): Promise<Account[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/me/friend', 'GET', {  });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async meRoute(): Promise<Account> {
    const request = this.#getRequest('https://leopold-server.warden.sk/me', 'GET', {  });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async meSecretRoute(body?: string, method: 'POST' = 'POST'): Promise<void> {
    const request = this.#getRequest('https://leopold-server.warden.sk/me/secret', method, {  }, body);
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async searchRoute(query: string): Promise<Account[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/search/:query', 'GET', { query });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  async testRoute(applicationVersionId: string, path: string): Promise<Buffer> {
    const request = this.#getRequest('https://leopold-application.warden.sk/:applicationVersionId(?<path>/[^#/?]+)', 'GET', { applicationVersionId, path });
    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
  #getRequest(url: string, method: string, $: { [left: string]: string | undefined }, body?: string): Request {
    for (const left of Object.keys($)) {
      const right = $[left];
      if (right) {
        url = url.replace(new RegExp(`/:${left}\\??`), `/${right}`);
      } else {
        url = url.replace(new RegExp(`/:${left}\\??`), '');
      }
    }
    report('OUT', method, url);
    return new Request(url, { body, credentials: 'include', headers: { Accept: 'application/json' }, method });
  }
}
export default Intercom;
