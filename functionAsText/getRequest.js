function getRequest() {
  return `  #getRequest(url: string, method: string, $: { [left: string]: string | undefined }, body?: string): Request {
    for (const left of Object.keys($)) {
      const right = $[left];
      if (right) {
        url = url.replace(new RegExp(\`/:\${left}\\\\??\`), \`/\${right}\`);
      } else {
        url = url.replace(new RegExp(\`/:\${left}\\\\??\`), '');
      }
    }
    report('OUT', method, url);
    return new Request(url, { body, credentials: 'include', headers: { Accept: 'application/json' }, method });
  }
`;
}
exports.default = getRequest;
