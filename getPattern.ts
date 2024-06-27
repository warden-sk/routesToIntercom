/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

import invariant from '@helpers/validation/invariant';
import parseCallExpression from './parseCallExpression';
import ts from 'typescript';
import typeAsText from './typeAsText';

type GetPatternOutput = {
  parameters: [string, string][];
  url: string;
};

function getPattern({ declarationList }: ts.VariableStatement): GetPatternOutput {
  invariant(declarationList.declarations.length, '(1)');

  const variableDeclaration = declarationList.declarations[0]!;

  invariant(variableDeclaration.initializer && ts.isCallExpression(variableDeclaration.initializer), '(2)');

  const parsedCallExpression = parseCallExpression(variableDeclaration.initializer);

  const typeArguments = parsedCallExpression.typeArguments.filter(typeArgument => typeArgument.kind === 'TypeLiteral');

  let parameters: [string, string][] = [];

  if (typeArguments.length === 1) {
    parameters = typeArguments[0]!.of.reduce<[string, string][]>((parameters, member) => {
      if (member.kind === 'PropertySignature') {
        let type = `: ${typeAsText(member.of)}`;

        if (member.hasQuestionToken) {
          type = `?${type}`;
        }

        return [...parameters, [member.name, type]];
      }

      return parameters;
    }, []);
  }

  invariant(parsedCallExpression.arguments[0]?.kind === 'StringLiteral', '(3)');

  return {
    parameters,
    url: `https://server.redred.app${parsedCallExpression.arguments[0].text}`,
  };
}

export type { GetPatternOutput };

export default getPattern;
