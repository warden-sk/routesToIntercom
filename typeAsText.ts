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
    case 'StringKeyword':
      return 'string';
    case 'TypeLiteral':
      function parseMember(member: ParseArgumentOutput) {
        if (member.kind === 'PropertySignature') {
          // `hasQuestionToken`
          return [member.name, typeAsText(member.of)].join(': ');
        }
      }

      return `{ ${$.of.map(parseMember).join('; ')} }`;
    case 'TypeReference':
      return $.typeName;
    case 'UnionType':
      return $.of.map(typeAsText).join(' | ');
  }

  return $.kind;
}

export default typeAsText;
