/*
 * Copyright 2023 Marek Kobida
 */

function getAsyncFunction(input) {
  const { method, name, type, url } = input;

  // (3/3) method to `Union` or `string`
  let methodAsText = Array.isArray(method) ? method.map($ => `'${$}'`).join(' | ') : `'${method}'`;
  methodAsText += ` = '${Array.isArray(method) ? method[0] : method}'`;

  /* (2/3) */ const hasBody = Array.isArray(method) || ['DELETE', 'PATCH', 'POST', 'PUT'].indexOf(method) !== -1;

  /* (1/3) */ const argumentsAsText = input.arguments[0]
    ? `${input.arguments[0]}${hasBody ? `, body?: string, method: ${methodAsText}` : ''}`
    : hasBody
    ? `body?: string, method: ${methodAsText}`
    : '';

  const requestArguments = input.arguments[1] ? `{ ${input.arguments[1]} }` : '{}';
  const requestBody = hasBody ? ', body' : '';
  const requestMethod = hasBody ? 'method' : `'GET'`;

  return `  async ${name}(${argumentsAsText}): Promise<${type}> {
    const request = this.#getRequest('${url}', ${requestMethod}, ${requestArguments}${requestBody});

    return new Promise(async (onResponse, onError) =>
      fetch(request)
        .then(async response => {
          if (response.status === 204) {
            return onResponse();
          }
          return response.json();
        })
        .then(
          json => {
            if (json && json.error) {
              onError(json.error);
            } else {
              onResponse(json);
            }
          },
          error => onError({ message: error.message, name: error.name })
        )
    );
  }
`;
}

exports.default = getAsyncFunction;
