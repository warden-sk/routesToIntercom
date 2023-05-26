/*
 * Copyright 2023 Marek Kobida
 */

import type { Account } from '../../server/storages/AccountStorage';
import type { Category } from '../../server/storages/CategoryStorage';
import type { TransformedApplication } from '../../server/transformers/transformApplication';
import type { TransformedApplicationVersion } from '../../server/transformers/transformApplicationVersion';

class Intercom {
  static VERSION = '1.0.0+1685096248712';

  async accountApplicationRoute(accountId: string): Promise<TransformedApplication[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/account/:accountId/application', 'GET', { accountId });

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async accountFriendRoute(accountId: string): Promise<Account[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/account/:accountId/friend', 'GET', { accountId });

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async accountRoute(accountId?: string): Promise<Account | Account[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/account/:accountId?', 'GET', { accountId });

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async applicationRoute(applicationId?: string): Promise<TransformedApplication | TransformedApplication[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/application/:applicationId?', 'GET', { applicationId });

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async applicationSubscribeRoute(applicationVersionId: string): Promise<void> {
    const request = this.#getRequest('https://leopold-server.warden.sk/application/:applicationVersionId/subscribe', 'GET', { applicationVersionId });

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async applicationUnsubscribeRoute(applicationVersionId: string): Promise<void> {
    const request = this.#getRequest('https://leopold-server.warden.sk/application/:applicationVersionId/unsubscribe', 'GET', { applicationVersionId });

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async applicationVersionRoute(applicationId: string): Promise<TransformedApplicationVersion[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/application/:applicationId/version', 'GET', { applicationId });

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async signInRoute(body?: string, method: 'POST' = 'POST'): Promise<Account> {
    const request = this.#getRequest('https://leopold-server.warden.sk/sign-in', method, {}, body);

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async signOutRoute(): Promise<void> {
    const request = this.#getRequest('https://leopold-server.warden.sk/sign-out', 'GET', {});

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async categoryRoute(): Promise<Category[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/category', 'GET', {});

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async meFriendRequestRoute(id?: string, body?: string, method: 'GET' | 'DELETE' | 'POST' = 'GET'): Promise<{ account: Account; id: string }[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/me/friend/request/:id?', method, { id }, body);

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async meFriendRoute(): Promise<Account[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/me/friend', 'GET', {});

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async meRoute(): Promise<Account> {
    const request = this.#getRequest('https://leopold-server.warden.sk/me', 'GET', {});

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async meSecretRoute(body?: string, method: 'POST' = 'POST'): Promise<void> {
    const request = this.#getRequest('https://leopold-server.warden.sk/me/secret', method, {}, body);

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async searchRoute(query: string): Promise<Account[]> {
    const request = this.#getRequest('https://leopold-server.warden.sk/search/:query', 'GET', { query });

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
  }

  async testRoute(applicationVersionId: string, path: string): Promise<Buffer> {
    const request = this.#getRequest('https://leopold-application.warden.sk/:applicationVersionId(?<path>/[^#/?]+)', 'GET', { applicationVersionId, path });

    return new Promise(async (onResponse, onError) => {
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            setTimeout(() => onResponse(), 0);
          } else {
            return response.json();
          }
        })
        .then(
          json => {
            setTimeout(() => {
              if (json && json.error) {
                onError(json.error);
              } else {
                onResponse(json);
              }
            }, 0);
          },
          error => setTimeout(() => onError({ message: error.message, name: error.name }), 0)
        );
    });
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

    return new Request(url, { body, credentials: 'include', headers: { Accept: 'application/json', 'Intercom-Version': Intercom.VERSION }, method });
  }
}

export default Intercom;
