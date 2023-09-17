/*
 * Copyright 2023 Marek Kobida
 */

import type ts from 'typescript';
import type { GetPatternOutput } from './getPattern';
import type { GetRouteOutput } from './getRoute';

interface ArrayType {
  kind: 'ArrayType';
  of: ParseArgumentOutput;
}

interface ArrowFunction {
  kind: 'ArrowFunction';
  typeArguments: ParseArgumentOutput[];
}

interface Identifier {
  kind: 'Identifier';
  text: string;
}

interface IntersectionType {
  kind: 'IntersectionType';
  of: ParseArgumentOutput[];
}

interface ParenthesizedType {
  kind: 'ParenthesizedType';
  of: ParseArgumentOutput;
}

interface ParseFileOutput {
  fileName: string;
  pattern: GetPatternOutput;
  routes: GetRouteOutput[];
}

interface PropertySignature {
  hasQuestionToken: boolean;
  kind: 'PropertySignature';
  name: string;
  of: ParseArgumentOutput;
}

interface StringLiteral {
  kind: 'StringLiteral';
  text: string;
}

interface TypeLiteral {
  kind: 'TypeLiteral';
  of: ParseArgumentOutput[];
}

interface TypeReference {
  kind: 'TypeReference';
  typeName: string;
}

interface UnionType {
  kind: 'UnionType';
  of: ParseArgumentOutput[];
}

type ExcludeKeys =
  | 'ArrayType'
  | 'ArrowFunction'
  | 'Identifier'
  | 'IntersectionType'
  | 'ParenthesizedType'
  | 'PropertySignature'
  | 'StringLiteral'
  | 'TypeLiteral'
  | 'TypeReference'
  | 'UnionType';

type FilteredSyntaxKindKeys = Exclude<SyntaxKindKeys, ExcludeKeys>;

type ParseArgumentOutput =
  | ArrayType
  | ArrowFunction
  | Identifier
  | IntersectionType
  | ParenthesizedType
  | PropertySignature
  | StringLiteral
  | TypeLiteral
  | TypeReference
  | UnionType
  | { kind: FilteredSyntaxKindKeys };

type SyntaxKindKeys = keyof typeof ts.SyntaxKind;

export type { FilteredSyntaxKindKeys, ParseArgumentOutput, ParseFileOutput, TypeLiteral };
