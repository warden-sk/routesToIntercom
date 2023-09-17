/*
 * Copyright 2023 Marek Kobida
 */

function getSendRequestFunction(): string {
  return `  async #sendRequest<T>(request: Request, requestId: number): Promise<T> {
    let latency = +new Date();

    this.#history = [{ id: requestId, request, state: 0 }, ...this.#history];
    this.#update();

    const response = await fetch(request);

    latency = +new Date() - latency;

    if (response.headers.has('Client-Version')) {
      const clientVersion = response.headers.get('Client-Version')!;

      this.#clientVersion = clientVersion;
    }

    const json = await response.json();

    console.log('[Intercom]', \`\${latency} ms\`, request.method, request.url, json);

    this.#history = this.#history.map($ => ($.id === requestId ? { ...$, latency, state: 1 } : $));
    this.#update();

    if (json && json.error) {
      throw json.error;
    }

    return json;
  }`;
}

export default getSendRequestFunction;
