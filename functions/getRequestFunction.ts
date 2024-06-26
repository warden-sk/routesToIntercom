/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 26.06.2024
 */

function getRequestFunction(): string {
  return `  getRequest(options: {
    abortController: AbortController;
    body?: ReadableStream;
    method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
    parameters?: Record<string, string | undefined>;
    url: string;
  }): [Request, number] {
    let { abortController, body, method = 'GET', parameters = {}, url } = options;

    const requestId = this.history.length ? this.history[0]!.id + 1 : 0;

    abortController.signal.addEventListener('abort', () => {
      this.history = this.history.map(row =>
        row.id === requestId ? { ...row, state: row.latency ? row.state : 2 } : row,
      );

      this.update();
    });

    for (const parameterName of Object.keys(parameters)) {
      const parameter = parameters[parameterName];
      const pattern = \`/:\${parameterName}\\\\??\`;

      if (parameter) {
        url = url.replace(new RegExp(pattern), \`/\${parameter}\`);
      } else {
        url = url.replace(new RegExp(pattern), '');
      }
    }

    const headers = new Headers({ Accept: 'application/json', 'Intercom-Version': this.VERSION });

    const request = new Request(url, { body, credentials: 'include', headers, method, signal: abortController.signal });

    return [request, requestId];
  }`;
}

export default getRequestFunction;
