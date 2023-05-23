const typescript = require('typescript');
const invariant = require('../../helpers/invariant').default;
const parseCallExpression = require('./parseCallExpression').default;

function parseVariableDeclaration(node) {
  invariant(
    node.initializer && typescript.isCallExpression(node.initializer),
    '`VariableDeclaration` initializer is not an `CallExpression`'
  );

  invariant(typescript.isIdentifier(node.name), '`VariableDeclaration` name is not an `Identifier`');

  return {
    callExpression: parseCallExpression(node.initializer),
    name: node.name.text,
  };
}

exports.default = parseVariableDeclaration;
