/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 26.06.2024
 */

import invariant from '@helpers/validation/invariant';
import parseArgument from './parseArgument';
import ts from 'typescript';
import type { ParseArgumentOutput } from './types';

type ParseCallExpressionOutput = {
  arguments: ParseArgumentOutput[];
  kind: string;
  name: string;
  typeArguments: ParseArgumentOutput[];
};

function parseCallExpression(callExpression: ts.CallExpression): ParseCallExpressionOutput {
  invariant(ts.isPropertyAccessExpression(callExpression.expression), '(1)');

  const propertyAccessExpression = callExpression.expression;

  if (ts.isNewExpression(propertyAccessExpression.expression)) {
    /**
     * new Pattern<{ accountId?: string }>('/account/:accountId?').getServerRoutePattern();
     *     |      |                       |
     *     |      |                       `- arguments[]
     *     |      `------------------------- typeArguments[]
     *     `-------------------------------- name
     */

    const newExpression = propertyAccessExpression.expression;

    const name = newExpression.expression;
    invariant(ts.isIdentifier(name), '(2)');

    return {
      arguments: newExpression.arguments ? newExpression.arguments.map(parseArgument) : [],
      kind: 'NewExpression',
      name: name.text,
      typeArguments: newExpression.typeArguments ? newExpression.typeArguments.map(parseArgument) : [],
    };
  }

  /**
   * router.createAuthorizedRoute('GET', PATTERN, () => {});
   *        |                    |
   *        `- name              `- arguments[]
   */
  return {
    arguments: callExpression.arguments.length ? callExpression.arguments.map(parseArgument) : [],
    kind: 'PropertyAccessExpression',
    name: propertyAccessExpression.name.text,
    typeArguments: [],
  };
}

export type { ParseCallExpressionOutput };

export default parseCallExpression;
