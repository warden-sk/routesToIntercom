const typescript_1 = require('typescript');
const invariant_1 = require('../../helpers/invariant').default;
function parseArguments(node) {
  if (typescript_1.isArrayTypeNode(node)) {
    return { kind: 'ArrayType', of: parseArguments(node.elementType) };
  }
  if (typescript_1.isArrowFunction(node)) {
    let typeArguments = [];
    // if `Promise`
    if (node.type && typescript_1.isTypeReferenceNode(node.type)) {
      if (node.type.typeArguments) {
        typeArguments = node.type.typeArguments.map(parseArguments);
      }
    }
    return { kind: 'ArrowFunction', typeArguments };
  }
  if (typescript_1.isIdentifier(node)) {
    return { kind: 'Identifier', text: node.text };
  }
  if (typescript_1.isLiteralTypeNode(node) && typescript_1.isStringLiteral(node.literal)) {
    return { kind: 'LiteralType', text: `'${node.literal.text}'` };
  }
  if (typescript_1.isPropertySignature(node)) {
    invariant_1(typescript_1.isIdentifier(node.name), '`PropertySignature` name is not an `Identifier`');
    invariant_1(node.type, '`PropertySignature` does not have a type');
    return {
      hasQuestionToken: !!node.questionToken,
      kind: 'PropertySignature',
      of: parseArguments(node.type),
      text: node.name.text,
    };
  }
  if (typescript_1.isStringLiteral(node)) {
    return { kind: 'StringLiteral', text: node.text };
  }
  if (typescript_1.isTypeLiteralNode(node)) {
    return { kind: 'TypeLiteral', of: node.members.map(parseArguments) };
  }
  if (typescript_1.isTypeReferenceNode(node)) {
    invariant_1(typescript_1.isIdentifier(node.typeName), '`TypeReferenceNode` typeName is not an `Identifier`');
    return { kind: 'TypeReference', text: node.typeName.text };
  }
  if (typescript_1.isUnionTypeNode(node)) {
    return { kind: 'UnionType', of: node.types.map(parseArguments) };
  }
  return { kind: typescript_1.SyntaxKind[node.kind] };
}
exports.default = parseArguments;
