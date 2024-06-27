/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

import invariant from '@helpers/validation/invariant';
import ts from 'typescript';
import type { FilteredSyntaxKindKeys, ParseArgumentOutput } from '../types';

function parseArgument(argument: ts.Node): ParseArgumentOutput {
  if (ts.isArrayTypeNode(argument)) {
    return { kind: 'ArrayType', of: parseArgument(argument.elementType) };
  }

  if (ts.isArrowFunction(argument)) {
    return { kind: 'ArrowFunction', type: argument.type && parseArgument(argument.type) };
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
    invariant(ts.isIdentifier(argument.name), '710931e5-3142-4cb6-a653-a7446e0eae0d');
    invariant(argument.type, '3088deb6-6f21-46cd-ba3d-15b9ed1588eb');

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
    invariant(ts.isIdentifier(argument.typeName), '51354191-9093-4985-86f0-a6432729f3da');

    return {
      kind: 'TypeReference',
      typeArguments: argument.typeArguments?.map(parseArgument) ?? [],
      typeName: argument.typeName.text,
    };
  }

  if (ts.isUnionTypeNode(argument)) {
    return { kind: 'UnionType', of: argument.types.map(parseArgument) };
  }

  return { kind: ts.SyntaxKind[argument.kind] as FilteredSyntaxKindKeys };
}

export default parseArgument;
