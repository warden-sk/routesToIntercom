/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

function getRequestFunction(): string {
  return `  #getRequest({ abortController, body, method = 'GET', parameters = {}, url }: GetRequestInput): GetRequestOutput {
    const headers = new Headers({ Accept: 'application/json', 'Intercom-Version': this.VERSION });

    const request = new Request(this.#transformUrl(parameters, url), {
      body,
      credentials: 'include',
      headers,
      method,
      signal: abortController?.signal,
    });

    const requestId = this.#history.length ? this.#history[0]!.id + 1 : 0;

    return [request, requestId];
  }`;
}

export default getRequestFunction;
