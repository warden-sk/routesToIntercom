/*
 * Copyright 2023 Marek Kobida
 */

import ts from 'typescript';
import getRoute from './getRoute';
import type { GetRouteOutput } from './getRoute';

function getRoutes(expressionStatements: ts.ExpressionStatement[]): GetRouteOutput[] {
  return expressionStatements.reduce<GetRouteOutput[]>(
    ($, expressionStatement) =>
      ts.isCallExpression(expressionStatement.expression) ? [...$, getRoute(expressionStatement.expression)] : $,
    [],
  );
}

export default getRoutes;
