/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

import invariant from '@helpers/validation/invariant';
import type { ParseCallExpressionOutput } from './parsing/parseCallExpression';
import parseCallExpression from './parsing/parseCallExpression';
import type ts from 'typescript';
import typeAsText from './typeAsText';

type GetRouteOutput = {
  httpMethod: string;
  httpResponseType: string;
  isAuthorizedRoute: boolean;
  parent: ParseCallExpressionOutput;
};

function getRoute(callExpression: ts.CallExpression): GetRouteOutput {
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

export type { GetRouteOutput };

export default getRoute;
