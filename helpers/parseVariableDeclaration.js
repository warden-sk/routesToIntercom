const typescript_1 = require('typescript');
const invariant_1 = require('../../helpers/invariant').default;
const parseCallExpression_1 = require('./parseCallExpression').default;
function parseVariableDeclaration(node) {
  invariant_1(typescript_1.isIdentifier(node.name), '`VariableDeclaration` name is not an `Identifier`');
  invariant_1(
    node.initializer && typescript_1.isCallExpression(node.initializer),
    '`VariableDeclaration` initializer is not an `CallExpression`'
  );
  return { callExpression: parseCallExpression_1(node.initializer), name: node.name.text };
}
exports.default = parseVariableDeclaration;
