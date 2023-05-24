function getAsyncFunction(input) {
  const { method, name, type, url } = input;

  const hasBody = Array.isArray(method) || ['DELETE', 'PATCH', 'POST', 'PUT'].indexOf(method) !== -1;

  let methodToString = Array.isArray(method) ? method.map($ => `'${$}'`).join(' | ') : `'${method}'`;
  methodToString += ` = '${Array.isArray(method) ? method[method.length - 1] : method}'`;

  const $ = input.arguments[0]
    ? `${input.arguments[0]}${hasBody ? `, body?: string, method: ${methodToString}` : ''}`
    : hasBody
    ? `body?: string, method: ${methodToString}`
    : '';

  const $$ = input.arguments[1] ? `{ ${input.arguments[1]} }` : '{}';

  const requestBody = hasBody ? ', body' : '';
  const requestMethod = hasBody ? 'method' : `'GET'`;

  return `  async ${name}(${$}): Promise<${type}> {
    const request = this.#getRequest('${url}', ${requestMethod}, ${$$}${requestBody});

    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => response.json())
        .then(
          json => (json.error ? onError(json.error) : onResponse(json)),
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
`;
}

exports.default = getAsyncFunction;
