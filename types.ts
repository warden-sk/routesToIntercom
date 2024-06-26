/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 26.06.2024
 */

import type ts from 'typescript';
import type { GetPatternOutput } from './getPattern';
import type { GetRouteOutput } from './getRoute';

type ArrayType = {
  kind: 'ArrayType';
  of: ParseArgumentOutput;
};

type ArrowFunction = {
  kind: 'ArrowFunction';
  typeArguments: ParseArgumentOutput[];
};

type Identifier = {
  kind: 'Identifier';
  text: string;
};

type IntersectionType = {
  kind: 'IntersectionType';
  of: ParseArgumentOutput[];
};

type ParenthesizedType = {
  kind: 'ParenthesizedType';
  of: ParseArgumentOutput;
};

type ParseFileOutput = {
  fileName: string;
  pattern: GetPatternOutput;
  routes: GetRouteOutput[];
};

type PropertySignature = {
  hasQuestionToken: boolean;
  kind: 'PropertySignature';
  name: string;
  of: ParseArgumentOutput;
};

type StringLiteral = {
  kind: 'StringLiteral';
  text: string;
};

type TypeLiteral = {
  kind: 'TypeLiteral';
  of: ParseArgumentOutput[];
};

type TypeReference = {
  kind: 'TypeReference';
  typeName: string;
};

type UnionType = {
  kind: 'UnionType';
  of: ParseArgumentOutput[];
};

/* —————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

type FilteredSyntaxKindKeys = Exclude<
  SyntaxKindKeys,
  | 'ArrayType'
  | 'ArrowFunction'
  | 'Identifier'
  | 'IntersectionType'
  | 'ParenthesizedType'
  | 'PropertySignature'
  | 'StringLiteral'
  | 'TypeLiteral'
  | 'TypeReference'
  | 'UnionType'
>;

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
