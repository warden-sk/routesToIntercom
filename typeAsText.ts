/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 26.06.2024
 */

import type { ParseArgumentOutput } from './types';

function typeAsText($: ParseArgumentOutput): string {
  switch ($.kind) {
    case 'ArrayType':
      return `${typeAsText($.of)}[]`;
    case 'IntersectionType':
      return $.of.map(typeAsText).join(' & ');
    case 'ParenthesizedType':
      return `(${typeAsText($.of)})`;
    case 'PropertySignature':
      return [$.name, typeAsText($.of)].join(': ');
    case 'StringKeyword':
      return 'string';
    case 'TypeLiteral':
      return `{ ${$.of.map(typeAsText).join('; ')} }`;
    case 'TypeReference':
      return $.typeName;
    case 'UnionType':
      return $.of.map(typeAsText).join(' | ');
  }

  return $.kind;
}

export default typeAsText;
