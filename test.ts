/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 26.06.2024
 */

import files from './files';
import fs from 'node:fs';
import parseFile from './parseFile';
import template from './template';

(async () => {
  const functionDefinitions: string[] = [],
    typeDefinitions: string[] = [];

  for (const [filePath, fileId] of files) {
    const parsedFile = await parseFile(filePath);

    /**
     * (1) TYPE DEFINITION PARAMETERS
     */
    const formatParameterList = (hasTypes: boolean): string =>
      parsedFile.pattern.parameters
        .map(([parameterName, parameterType]) => (hasTypes ? `${parameterName}${parameterType}` : parameterName))
        .join(', ');

    const formattedParameters = parsedFile.pattern.parameters.length ? `{ ${formatParameterList(true)} }` : '{}';

    /**
     * (2) TYPE DEFINITIONS
     */
    const formattedFunctionSignatures = parsedFile.routes.map(
      route =>
        `  (parameters?: ${formattedParameters}, method?: '${route.httpMethod}', body?: unknown): Promise<${route.httpResponseType}>;`,
    );

    // language=ts
    const typeDefinition = `type ${fileId} = {
${formattedFunctionSignatures.join('\n')}
  abort: () => void;
  error?: { message: string; name: string };
  isFetching: boolean;
};`;

    typeDefinitions.push(typeDefinition);

    /**
     * (3) FUNCTION DEFINITIONS
     */
    functionDefinitions.push(`  ${parsedFile.fileName}(): ${fileId} {
    return this.#use<${fileId}>('${parsedFile.pattern.url}');
  }`);
  }

  fs.writeFileSync(
    '/Users/marekkobida/Documents/warden/leopold/intercom/Intercom.new.ts',
    template(functionDefinitions.join('\n\n'), typeDefinitions.join('\n\n')),
  );
})();
