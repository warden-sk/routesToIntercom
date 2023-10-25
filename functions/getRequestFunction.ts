/*
 * Copyright 2023 Marek Kobida
 */

function getRequestFunction(): string {
  return `  #getRequest(options: GetRequestOptions): [Request, number] {
    let { abortController, json, method = 'GET', parameters = {}, url } = options;

    const requestId = this.#history.length ? this.#history[0]!.id + 1 : 0;

    abortController.signal.addEventListener(
      'abort',
      /**/ () => {
        this.#history = this.#history.map($ => ($.id === requestId ? { ...$, state: $.latency ? $.state : 2 } : $));

        this.#update();
      },
    );

    for (const parameterName of Object.keys(parameters)) {
      const parameter = parameters[parameterName];

      if (parameter) {
        url = url.replace(new RegExp(\`/:\${parameterName}\\\\??\`), \`/\${parameter}\`);
      } else {
        url = url.replace(new RegExp(\`/:\${parameterName}\\\\??\`), '');
      }
    }

    const headers = new Headers({ Accept: 'application/json', 'Intercom-Version': this.VERSION });

    const request = new Request(url, { body: JSON.stringify(json), credentials: 'include', headers, method, signal: abortController.signal });

    return [request, requestId];
  }`;
}

export default getRequestFunction;
