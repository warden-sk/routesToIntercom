/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

import files from './files';
import node from '@helpers/node';
import parseFile from './parsing/parseFile';
import template from './template';
import Σ from '@helpers/Σ';

(async () => {
  const functionDefinitions: string[] = [],
    typeDefinitions: string[] = [];

  for (const i in files) {
    const parsedFile = await Σ(files[i]!, parseFile);

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
    const typeDefinition = `type T${i} = T & {
${formattedFunctionSignatures.join('\n')}
};`;

    typeDefinitions.push(typeDefinition);

    /**
     * (4) FUNCTION DEFINITIONS
     */
    functionDefinitions.push(`  ${parsedFile.fileName}(): T${i} {
    return this.#use<T${i}>('${parsedFile.pattern.url}');
  }`);
  }

  await node.writeFile(
    '/Users/marekkobida/Documents/warden/leopold/intercom/Intercom.new.ts',
    template(functionDefinitions.join('\n\n'), typeDefinitions.join('\n\n')),
  );
})();
