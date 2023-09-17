/*
 * Copyright 2023 Marek Kobida
 */

import invariant from '@helpers/validation/invariant';
import ts from 'typescript';
import parseArgument from './parseArgument';
import type { ParseArgumentOutput } from './types';

interface O {
  arguments: ParseArgumentOutput[];
  kind: string;
  name: string;
  typeArguments: ParseArgumentOutput[];
}

function parseCallExpression(callExpression: ts.CallExpression): O {
  invariant(ts.isPropertyAccessExpression(callExpression.expression), '(1)');

  const propertyAccessExpression = callExpression.expression;

  if (ts.isNewExpression(propertyAccessExpression.expression)) {
    /**
     * new Pattern<{ accountId?: string }>('/account/:accountId?').getServerRoutePattern();
     *     |       |                       |
     *     |       |                       `- arguments[]
     *     |       `------------------------- typeArguments[]
     *     `--------------------------------- name
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

  return {
    arguments: callExpression.arguments.length ? callExpression.arguments.map(parseArgument) : [],
    kind: 'PropertyAccessExpression',
    name: propertyAccessExpression.name.text,
    typeArguments: [],
  };
}

export type { O as ParseCallExpressionOutput };

export default parseCallExpression;
