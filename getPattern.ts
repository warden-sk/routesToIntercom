/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 30.06.2024
 */

import invariant from '@helpers/validation/invariant';
import parseCallExpression from './parsing/parseCallExpression';
import ts from 'typescript';
import typeAsText from './typeAsText';

type GetPatternOutput = {
  parameters: [name: string, type: string][];
  url: string;
};

function getPattern({ declarationList }: ts.VariableStatement): GetPatternOutput {
  invariant(declarationList.declarations.length, '6951de81-1243-44ae-a44b-030e3b7225ca');

  const variableDeclaration = declarationList.declarations[0]!;

  invariant(
    variableDeclaration.initializer && ts.isCallExpression(variableDeclaration.initializer),
    'ef5bcb81-7140-479e-96a3-4f035f3425d8',
  );

  const parsedCallExpression = parseCallExpression(variableDeclaration.initializer);

  const [firstArgument] = parsedCallExpression.arguments;

  const [firstTypeArgument] = parsedCallExpression.typeArguments.filter(
    typeArgument => typeArgument.kind === 'TypeLiteral',
  );

  /**
   * Parameter(s)
   */
  let parameters: [name: string, type: string][] = [];

  if (firstTypeArgument) {
    parameters = firstTypeArgument.of
      .filter(member => member.kind === 'PropertySignature')
      // { id?: string } → ['id', '?: string']
      .map(member => [member.name, `${member.hasQuestionToken ? '?' : ''}: ${typeAsText(member.of)}`]);
  }

  /**
   * Url
   */
  invariant(firstArgument?.kind === 'StringLiteral', '8345f89e-7939-42cc-94dc-2b531f7bdf7a');

  return { parameters, url: `https://server.redred.app${firstArgument.text}` };
}

export type { GetPatternOutput };

export default getPattern;
