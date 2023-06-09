/*
 * Copyright 2023 Marek Kobida
 */

function getRequestFunction() {
  return `  #getRequest(url: string, method: string, $: { [left: string]: string | undefined }, body?: string): Request {
    for (const left of Object.keys($)) {
      const right = $[left];

      if (right) {
        url = url.replace(new RegExp(\`/:\${left}\\\\??\`), \`/\${right}\`);
      } else {
        url = url.replace(new RegExp(\`/:\${left}\\\\??\`), '');
      }
    }

    return new Request(url, { body, credentials: 'include', headers: { Accept: 'application/json', 'Intercom-Version': Intercom.VERSION }, method });
  }
`;
}

exports.default = getRequestFunction;
