/*
 * Copyright 2023 Marek Kobida
 */

import invariant from '@helpers/validation/invariant';
import type ts from 'typescript';
import parseCallExpression from './parseCallExpression';
import type { ParseCallExpressionOutput } from './parseCallExpression';
import typeAsText from './typeAsText';

interface O {
  httpMethod: string;
  httpResponseType: string;
  isAuthorizedRoute: boolean;
  parent: ParseCallExpressionOutput;
}

function getRoute(callExpression: ts.CallExpression): O {
  const parsedCallExpression = parseCallExpression(callExpression);

  invariant(parsedCallExpression.arguments.length === 3, '(1)');

  invariant(parsedCallExpression.arguments[0]!.kind === 'StringLiteral', '(2)');
  invariant(parsedCallExpression.arguments[2]!.kind === 'ArrowFunction', '(3)');

  const httpMethod = parsedCallExpression.arguments[0].text;
  const httpResponseType = parsedCallExpression.arguments[2].typeArguments.map(typeAsText);
  const isAuthorizedRoute = parsedCallExpression.name === 'createAuthorizedRoute';

  return {
    httpMethod,
    httpResponseType: httpResponseType[0] ?? 'void',
    isAuthorizedRoute,
    parent: parsedCallExpression,
  };
}

export type { O as GetRouteOutput };

export default getRoute;
