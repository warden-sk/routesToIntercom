/*
 * Copyright 2023 Marek Kobida
 */

import type { ParseArgumentOutput } from './types';

function typeAsText($: ParseArgumentOutput): string {
  if ($.kind === 'ArrayType') {
    return `${typeAsText($.of)}[]`;
  }

  if ($.kind === 'IntersectionType') {
    return $.of.map(typeAsText).join(' & ');
  }

  if ($.kind === 'ParenthesizedType') {
    return `(${typeAsText($.of)})`;
  }

  if ($.kind === 'StringKeyword') {
    return 'string';
  }

  if ($.kind === 'TypeLiteral') {
    function parseMember(member: ParseArgumentOutput) {
      if (member.kind === 'PropertySignature') {
        // `hasQuestionToken`
        return [member.name, typeAsText(member.of)].join(': ');
      }
    }

    return `{ ${$.of.map(parseMember).join('; ')} }`;
  }

  if ($.kind === 'TypeReference') {
    return $.typeName;
  }

  if ($.kind === 'UnionType') {
    return $.of.map(typeAsText).join(' | ');
  }

  return $.kind;
}

export default typeAsText;
