/*
 * Copyright 2023 Marek Kobida
 */

import File from '@helpers/File';
import invariant from '@helpers/validation/invariant';
import ts from 'typescript';
import getPattern from './getPattern';
import getRoutes from './getRoutes';
import type { ParseFileOutput } from './types';

const FILE_NAME_PATTERN = /([^/]+)\.ts$/;

async function parseFile(filePath: string): Promise<ParseFileOutput> {
  const [, fileName] = FILE_NAME_PATTERN.exec(filePath) ?? [];

  invariant(fileName, 'Expected a valid `.ts` file name.');

  const file = await new File(filePath).readFile();
  const fileAsText = file.toString();

  const sourceFile = ts.createSourceFile(fileName, fileAsText, ts.ScriptTarget.ESNext);

  const expressionStatements = sourceFile.statements
    /**/ .filter(statement => ts.isExpressionStatement(statement)) as ts.ExpressionStatement[];

  invariant(expressionStatements.length, 'Expected at least one expression statement.');

  const variableStatements = sourceFile.statements
    /**/ .filter(statement => ts.isVariableStatement(statement)) as ts.VariableStatement[];

  invariant(variableStatements.length, 'Expected at least one variable statement.');

  const pattern = getPattern(variableStatements[0]!);
  const routes = getRoutes(expressionStatements);

  return { fileName, pattern, routes };
}

export default parseFile;
