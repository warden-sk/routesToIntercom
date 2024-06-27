/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

import invariant from '@helpers/validation/invariant';
import parseArgument from './parseArgument';
import ts from 'typescript';
import type { ParseArgumentOutput } from '../types';

type ParseCallExpressionOutput = {
  arguments: ParseArgumentOutput[];
  kind: string;
  name: string;
  typeArguments: ParseArgumentOutput[];
};

function parseCallExpression(callExpression: ts.CallExpression): ParseCallExpressionOutput {
  invariant(ts.isPropertyAccessExpression(callExpression.expression), 'cdd98964-ebf8-4b73-96a1-a3dc11f531d7');

  const propertyAccessExpression = callExpression.expression;

  /**
   * new Pattern<{ accountId?: string }>('/account/:accountId?').getServerRoutePattern();
   *     |      |                       |
   *     |      |                       `- arguments[]
   *     |      `------------------------- typeArguments[]
   *     `-------------------------------- name
   */
  if (ts.isNewExpression(propertyAccessExpression.expression)) {
    const newExpression = propertyAccessExpression.expression;

    const name = newExpression.expression;
    invariant(ts.isIdentifier(name), '5e6fd19c-02c8-4fc6-9aa9-773d28de7bf1');

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
