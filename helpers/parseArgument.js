const invariant = require('../../helpers/invariant').default;
const typescript = require('typescript');

function parseArgument(node) {
  if (typescript.isArrayTypeNode(node)) {
    return { kind: 'ArrayType', of: parseArgument(node.elementType) };
  }

  if (typescript.isArrowFunction(node)) {
    let typeArguments = [];

    // if `Promise`
    if (node.type && typescript.isTypeReferenceNode(node.type)) {
      if (node.type.typeArguments) {
        typeArguments = node.type.typeArguments.map(parseArgument);
      }
    }

    return { kind: 'ArrowFunction', typeArguments };
  }

  if (typescript.isIdentifier(node)) {
    return { kind: 'Identifier', text: node.text };
  }

  if (typescript.isLiteralTypeNode(node) && typescript.isStringLiteral(node.literal)) {
    return { kind: 'LiteralType', text: `'${node.literal.text}'` };
  }

  if (typescript.isPropertySignature(node)) {
    invariant(typescript.isIdentifier(node.name), '`PropertySignature` name is not an `Identifier`');
    invariant(node.type, '`PropertySignature` does not have a type');

    return {
      hasQuestionToken: !!node.questionToken,
      kind: 'PropertySignature',
      of: parseArgument(node.type),
      text: node.name.text,
    };
  }

  if (typescript.isStringLiteral(node)) {
    return { kind: 'StringLiteral', text: node.text };
  }

  if (typescript.isTypeLiteralNode(node)) {
    return { kind: 'TypeLiteral', of: node.members.map(parseArgument) };
  }

  if (typescript.isTypeReferenceNode(node)) {
    invariant(typescript.isIdentifier(node.typeName), '`TypeReferenceNode` typeName is not an `Identifier`');

    return { kind: 'TypeReference', text: node.typeName.text };
  }

  if (typescript.isUnionTypeNode(node)) {
    return { kind: 'UnionType', of: node.types.map(parseArgument) };
  }

  return { kind: typescript.SyntaxKind[node.kind] };
}

exports.default = parseArgument;
