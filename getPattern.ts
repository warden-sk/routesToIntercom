/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 28.06.2024
 */

import invariant from '@helpers/validation/invariant';
import messages from './messages';
import parseCallExpression from './parsing/parseCallExpression';
import ts from 'typescript';
import typeAsText from './typeAsText';

type GetPatternOutput = {
  parameters: [name: string, type: string][];
  url: string;
};

function getPattern({ declarationList }: ts.VariableStatement): GetPatternOutput {
  invariant(declarationList.declarations.length, 'Expected at least one variable declaration.');

  const variableDeclaration = declarationList.declarations[0]!;

  invariant(
    variableDeclaration.initializer && ts.isCallExpression(variableDeclaration.initializer),
    'Expected the variable declaration to be a `CallExpression`.',
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
  invariant(firstArgument?.kind === 'StringLiteral', messages.EXPECTED_FIRST_ARGUMENT_TO_BE_STRING_LITERAL);

  return { parameters, url: `https://server.redred.app${firstArgument.text}` };
}

export type { GetPatternOutput };

export default getPattern;
