/*
 * Copyright 2023 Marek Kobida
 */

function getRequestFunction(): string {
  return `  #getRequest(
    url: string,
    method = 'GET',
    $: { [left: string]: string | undefined } = {},
    signal: AbortSignal,
    body?: string,
  ): [Request, number] {
    const requestId = this.#history.length ? this.#history[0]!.id + 1 : 0;

    signal.addEventListener('abort', () => {
      this.#history = this.#history.map($ => ($.id === requestId ? { ...$, state: $.latency ? $.state : 2 } : $));

      this.#update();
    });

    for (const left of Object.keys($)) {
      const right = $[left];

      if (right) {
        url = url.replace(new RegExp(\`/:\${left}\\\\??\`), \`/\${right}\`);
      } else {
        url = url.replace(new RegExp(\`/:\${left}\\\\??\`), '');
      }
    }

    const headers = new Headers({ Accept: 'application/json', 'Intercom-Version': this.VERSION });

    const request = new Request(url, { body, credentials: 'include', headers, method, signal });

    return [request, requestId];
  }`;
}

export default getRequestFunction;
