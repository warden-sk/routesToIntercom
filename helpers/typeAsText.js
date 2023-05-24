function typeAsText(type) {
  switch (type.kind) {
    case 'ArrayType':
      return `${typeAsText(type.of)}[]`;
    case 'LiteralType':
      return type.text;
    case 'PropertySignature':
      return typeAsText(type.of);
    case 'StringKeyword':
      return 'string';
    case 'TypeLiteral':
      return `{ ${type.of.map(member => `${member.text}: ${typeAsText(member.of)}`).join('; ')} }`;
    case 'TypeReference':
      return type.text;
    case 'UnionType':
      return type.of.map(typeAsText).join(' | ');
    default:
      return type.kind;
  }
}

exports.default = typeAsText;
