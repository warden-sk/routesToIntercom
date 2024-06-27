/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

import type { GetRouteOutput } from './getRoute';
import getRoute from './getRoute';
import ts from 'typescript';

function getRoutes(expressionStatements: ts.ExpressionStatement[]): GetRouteOutput[] {
  return expressionStatements.reduce<GetRouteOutput[]>(
    ($, expressionStatement) =>
      ts.isCallExpression(expressionStatement.expression) ? [...$, getRoute(expressionStatement.expression)] : $,
    [],
  );
}

export default getRoutes;
