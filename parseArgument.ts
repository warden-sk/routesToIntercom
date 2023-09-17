/*
 * Copyright 2023 Marek Kobida
 */

import invariant from '@helpers/validation/invariant';
import ts from 'typescript';
import type { FilteredSyntaxKindKeys, ParseArgumentOutput } from './types';

function parseArgument(argument: ts.Node): ParseArgumentOutput {
  if (ts.isArrayTypeNode(argument)) {
    return { kind: 'ArrayType', of: parseArgument(argument.elementType) };
  }

  if (ts.isArrowFunction(argument)) {
    if (argument.type && ts.isTypeReferenceNode(argument.type)) {
      const isPromise = ts.isIdentifier(argument.type.typeName) && argument.type.typeName.text === 'Promise';

      const typeArguments = isPromise ? (argument.type.typeArguments ?? []).map(parseArgument) : [];

      return { kind: 'ArrowFunction', typeArguments };
    }

    return { kind: 'ArrowFunction', typeArguments: [] };
  }

  if (ts.isIdentifier(argument)) {
    return { kind: 'Identifier', text: argument.text };
  }

  if (ts.isIntersectionTypeNode(argument)) {
    return { kind: 'IntersectionType', of: argument.types.map(parseArgument) };
  }

  if (ts.isParenthesizedTypeNode(argument)) {
    return { kind: 'ParenthesizedType', of: parseArgument(argument.type) };
  }

  if (ts.isPropertySignature(argument)) {
    invariant(ts.isIdentifier(argument.name), '(1)');
    invariant(argument.type, '(2)');

    return {
      hasQuestionToken: !!argument.questionToken,
      kind: 'PropertySignature',
      name: argument.name.text,
      of: parseArgument(argument.type),
    };
  }

  if (ts.isStringLiteral(argument)) {
    return { kind: 'StringLiteral', text: argument.text };
  }

  if (ts.isTypeLiteralNode(argument)) {
    return { kind: 'TypeLiteral', of: argument.members.map(parseArgument) };
  }

  if (ts.isTypeReferenceNode(argument)) {
    invariant(ts.isIdentifier(argument.typeName), '(1)');

    return { kind: 'TypeReference', typeName: argument.typeName.text };
  }

  if (ts.isUnionTypeNode(argument)) {
    return { kind: 'UnionType', of: argument.types.map(parseArgument) };
  }

  return { kind: ts.SyntaxKind[argument.kind] as FilteredSyntaxKindKeys };
}

export default parseArgument;
