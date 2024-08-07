/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

function getSendRequestFunction(): string {
  return `  async #sendRequest<ResponseType>(request: Request, requestId: number): Promise<ResponseType> {
    this.#history = [{ id: requestId, request, state: 0 }, ...this.#history];
    this.#update();

    let latency = +new Date(); /* (1) */

    const response = await fetch(request);

    latency = +new Date() - latency; /* (2) */

    if (response.headers.has('Client-Version')) {
      this.#clientVersion = response.headers.get('Client-Version')!;
    }

    const json = await response.json();

    console.log('[Intercom]', \`\${latency} ms\`, request.method, request.url, json);

    this.#history = this.#history.map(row => (row.id === requestId ? { ...row, latency, state: 1 } : row));
    this.#update();

    if (json?.error) {
      throw json.error;
    }

    return json;
  }`;
}

export default getSendRequestFunction;
