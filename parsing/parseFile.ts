/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 30.06.2024
 */

import getPattern from '../getPattern';
import getRoute from '../getRoute';
import invariant from '@helpers/validation/invariant';
import messages from '../messages';
import node from '@helpers/node';
import ts from 'typescript';
import type { ParseFileOutput } from '../types';

async function parseFile(filePath: string): Promise<ParseFileOutput> {
  const [, fileName] = /([^/]+)\.ts$/.exec(filePath) ?? [];

  invariant(fileName, messages.EXPECTED_VALID_TS_FILE_NAME);

  const file = await node.readFile(filePath),
    sourceFile = ts.createSourceFile(fileName, file.toString(), ts.ScriptTarget.ESNext);

  const expressionStatements = sourceFile.statements.filter(ts.isExpressionStatement);
  invariant(expressionStatements.length, messages.EXPECTED_AT_LEAST_ONE_EXPRESSION_STATEMENT);

  const variableStatements = sourceFile.statements.filter(ts.isVariableStatement);
  invariant(variableStatements.length, messages.EXPECTED_AT_LEAST_ONE_VARIABLE_STATEMENT);

  const pattern = getPattern(variableStatements[0]!),
    routes = expressionStatements.map(getRoute);

  return { fileName, pattern, routes };
}

export default parseFile;
