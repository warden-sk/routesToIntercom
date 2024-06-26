/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 26.06.2024
 */

import files from './files';
import node from '@helpers/node';
import parseFile from './parseFile';
import template from './template';

(async () => {
  const functionDefinitions: string[] = [],
    typeDefinitions: string[] = [];

  for (const [filePath, fileId] of files) {
    const parsedFile = await parseFile(filePath);

    /**
     * (1) FUNCTION SIGNATURE PARAMETERS
     */
    const formatParameterList = (hasType: boolean): string =>
      parsedFile.pattern.parameters
        .map(([parameterName, parameterType]) => (hasType ? `${parameterName}${parameterType}` : parameterName))
        .join(', ');

    const formattedParameters = parsedFile.pattern.parameters.length ? `{ ${formatParameterList(true)} }` : '{}';

    /**
     * (2) FUNCTION SIGNATURES
     */
    const formattedFunctionSignatures = parsedFile.routes.map(
      route =>
        `  (parameters?: ${formattedParameters}, method?: '${route.httpMethod}', body?: GetRequestInput['body']): Promise<${route.httpResponseType}>;`,
    );

    /**
     * (3) TYPE DEFINITIONS
     */
    // language=ts
    const typeDefinition = `type ${fileId} = {
${formattedFunctionSignatures.join('\n')}

  abort: () => void;
  error?: { message: string; name: string };
  isFetching: boolean;
};`;

    typeDefinitions.push(typeDefinition);

    /**
     * (4) FUNCTION DEFINITIONS
     */
    functionDefinitions.push(`  ${parsedFile.fileName}(): ${fileId} {
    return this.#use<${fileId}>('${parsedFile.pattern.url}');
  }`);
  }

  await node.writeFile(
    '/Users/marekkobida/Documents/warden/leopold/intercom/Intercom.new.ts',
    template(functionDefinitions.join('\n\n'), typeDefinitions.join('\n\n')),
  );
})();
