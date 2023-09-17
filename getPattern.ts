/*
 * Copyright 2023 Marek Kobida
 */

import invariant from '@helpers/validation/invariant';
import ts from 'typescript';
import type { ParseCallExpressionOutput } from './parseCallExpression';
import parseCallExpression from './parseCallExpression';
import typeAsText from './typeAsText';
import type { TypeLiteral } from './types';

interface O {
  parameters: [string, string][];
  parent: ParseCallExpressionOutput;
  url: string;
}

function getPattern({ declarationList }: ts.VariableStatement): O {
  invariant(declarationList.declarations.length, '(1)');

  const variableDeclaration = declarationList.declarations[0]!;

  invariant(variableDeclaration.initializer && ts.isCallExpression(variableDeclaration.initializer), '(2)');

  const parsedCallExpression = parseCallExpression(variableDeclaration.initializer);

  const typeArguments = parsedCallExpression.typeArguments
    /**/ .filter(typeArgument => typeArgument.kind === 'TypeLiteral') as TypeLiteral[];

  let parameters: [string, string][] = [];

  if (typeArguments.length === 1) {
    parameters = typeArguments[0]!.of.reduce<[string, string][]>(
      (parameters, member) => {
        if (member.kind === 'PropertySignature') {
          let type = `: ${typeAsText(member.of)}`;

          if (member.hasQuestionToken) {
            type = `?${type}`;
          }

          return [...parameters, [member.name, type]];
        }

        return parameters;
      },
      /**/ [],
    );
  }

  invariant(parsedCallExpression.arguments[0]?.kind === 'StringLiteral', '(3)');

  return {
    parameters,
    parent: parsedCallExpression,
    url: `https://beta-server.redred.sk${parsedCallExpression.arguments[0].text}`,
  };
}

export type { O as GetPatternOutput };

export default getPattern;
