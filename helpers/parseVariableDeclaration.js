const typescript = require('typescript');
const invariant = require('../../helpers/invariant').default;
const parseCallExpression = require('./parseCallExpression').default;

function parseVariableDeclaration(node) {
  invariant(
    node.initializer && typescript.isCallExpression(node.initializer),
    '`VariableDeclaration` initializer is not an `CallExpression`'
  );

  return parseCallExpression(node.initializer);
}

exports.default = parseVariableDeclaration;
