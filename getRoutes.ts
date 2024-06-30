/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 28.06.2024
 */

import type { GetRouteOutput } from './getRoute';
import getRoute from './getRoute';
import type ts from 'typescript';

function getRoutes(expressionStatements: ts.ExpressionStatement[]): GetRouteOutput[] {
  return expressionStatements.map(getRoute);
}

export default getRoutes;
