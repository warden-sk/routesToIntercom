function getAsyncFunction(input) {
  const { hasMoreRoutes, method, name, type, url } = input;
  const hasBody = hasMoreRoutes || method === 'POST';
  const $ = input.arguments[0]
    ? `${input.arguments[0]}${hasBody ? `, body?: string | undefined, method = '${method}'` : ''}`
    : hasBody
    ? `body?: string | undefined, method = '${method}'`
    : '';
  const requestBody = hasBody ? ', body' : '';
  const requestMethod = hasBody ? 'method' : `'${method}'`;
  return `  async ${name}(${$}): Promise<${type}> {
    const request = this.#getRequest('${url}', ${requestMethod}, { ${input.arguments[1]} }${requestBody});
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
