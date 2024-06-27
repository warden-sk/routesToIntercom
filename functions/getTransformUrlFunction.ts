/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

function getTransformUrlFunction(): string {
  return `  #transformUrl(parameters: Record<string, string | undefined>, url: string): string {
    return Object.keys(parameters).reduce(
      (initialUrl, key) => initialUrl.replace(new RegExp(\`/:\${key}\\\\??\`), parameters[key] ? \`/\${parameters[key]}\` : ''),
      url,
    );
  }`;
}

export default getTransformUrlFunction;
