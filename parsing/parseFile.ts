/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

import getPattern from '../getPattern';
import getRoutes from '../getRoutes';
import invariant from '@helpers/validation/invariant';
import node from '@helpers/node';
import ts from 'typescript';
import type { ParseFileOutput } from '../types';

const FILE_NAME_PATTERN = /([^/]+)\.ts$/;

async function parseFile(filePath: string): Promise<ParseFileOutput> {
  const [, fileName] = FILE_NAME_PATTERN.exec(filePath) ?? [];

  invariant(fileName, 'Expected a valid `.ts` file name.');

  const file = await node.readFile(filePath),
    sourceFile = ts.createSourceFile(fileName, file.toString(), ts.ScriptTarget.ESNext);

  const expressionStatements = sourceFile.statements.filter(ts.isExpressionStatement);

  invariant(expressionStatements.length, 'Expected at least one expression statement.');

  const variableStatements = sourceFile.statements.filter(ts.isVariableStatement);

  invariant(variableStatements.length, 'Expected at least one variable statement.');

  const pattern = getPattern(variableStatements[0]!),
    routes = getRoutes(expressionStatements);

  return { fileName, pattern, routes };
}

export default parseFile;
