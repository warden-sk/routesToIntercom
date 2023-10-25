/*
 * Copyright 2023 Marek Kobida
 */

// dokončiť toto je súbor ktorý som nekontroloval
import File from '@helpers/File';
import getAllRouteFilesFromDirectory from './getAllRouteFilesFromDirectory';
import parseFile from './parseFile';
import template from './template';

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

(async () => {
  let __I__DONT__KNOW__1__: string[] = [];
  let __I__DONT__KNOW__3__: string[] = [];

  // dokončiť toto je novinka ktorú som neskontroloval
  const files = (
    await getAllRouteFilesFromDirectory('/Users/marekkobida/Documents/warden/leopold/server/routes/server')
  )
    .map(filePath => {
      const FILE_NAME_PATTERN = /([^/]+)\.ts$/;
      const [, fileName] = FILE_NAME_PATTERN.exec(filePath) ?? [];
      return [filePath, fileName] as [string, string];
    })
    .sort((a, b) => a[1].localeCompare(b[1], 'sk'));

  for (const [filePath] of files) {
    const output = await parseFile(filePath);

    const parametersAsText = (withTypes: boolean): string =>
      output.pattern.parameters
        .reduce<string[]>(($, parameter) => [...$, `${parameter[0]}${withTypes ? parameter[1] : ''}`], [])
        .join(', ');

    const parameters = output.pattern.parameters.length > 0 ? `{ ${parametersAsText(true)} }` : '{}';

    const functions = output.routes.reduce<string[]>(
      ($, route) => {
        const httpMethod = route.httpMethod;
        const httpResponseType = `Promise<${route.httpResponseType}>`;

        return [...$, `  (parameters?: ${parameters}, method?: '${httpMethod}', body?: unknown): ${httpResponseType};`];
      },
      /**/ [],
    );

    const __I__DONT__KNOW__2__ = `  ${output.fileName}(): ${capitalize(output.fileName)} {
    return this.#use<${capitalize(output.fileName)}>('${output.pattern.url}');
  }`;

    __I__DONT__KNOW__1__ = [...__I__DONT__KNOW__1__, __I__DONT__KNOW__2__];

    __I__DONT__KNOW__3__ = [
      ...__I__DONT__KNOW__3__,
      `interface ${capitalize(output.fileName)} {
${functions.join('\n')}
  abort: () => void;
  error?: { message: string; name: string };
  isFetching: boolean;
}`,
    ];
  }

  new File('/Users/marekkobida/Documents/warden/leopold/intercom/Intercom.ts')
    /**/ .writeFile(template(__I__DONT__KNOW__1__.join('\n\n'), __I__DONT__KNOW__3__.join('\n\n')));
})();
