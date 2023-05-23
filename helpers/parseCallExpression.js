const typescript_1 = require('typescript');
const invariant_1 = require('../../helpers/invariant').default;
const parseArguments_1 = require('./parseArguments').default;
function parseCallExpression(node) {
  const parsedArguments = node.arguments.map(argument => parseArguments_1(argument));
  invariant_1(
    typescript_1.isPropertyAccessExpression(node.expression),
    '`CallExpression` expression is not an `PropertyAccessExpression`'
  );
  const { expression, name } = node.expression;
  invariant_1(typescript_1.isIdentifier(expression), '`expression` is not an `Identifier`');
  invariant_1(typescript_1.isIdentifier(name), '`name` is not an `Identifier`');
  const typeArguments = node.typeArguments || [];
  const parsedTypeArguments = typeArguments.flatMap(typeArgument =>
    typescript_1.isTypeLiteralNode(typeArgument) ? typeArgument.members.map(member => parseArguments_1(member)) : []
  );
  return {
    arguments: parsedArguments,
    expression: `${expression.text}.${name.text}`,
    typeArguments: parsedTypeArguments,
  };
}
exports.default = parseCallExpression;
