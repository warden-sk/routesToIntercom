const invariant = require('../../helpers/invariant').default;
const parseArgument = require('./parseArgument').default;
const typescript = require('typescript');

const getArguments = $ => $.map(argument => parseArgument(argument));

const getTypeArguments = $ =>
  $?.flatMap(typeArgument =>
    typescript.isTypeLiteralNode(typeArgument) ? typeArgument.members.map(member => parseArgument(member)) : []
  );

function parseCallExpression(node) {
  invariant(
    typescript.isPropertyAccessExpression(node.expression),
    '`CallExpression` expression is not an `PropertyAccessExpression`'
  );

  const { expression, name } = node.expression;

  let arguments, typeArguments;

  if (typescript.isIdentifier(expression)) {
    arguments = getArguments(node.arguments);
    typeArguments = getTypeArguments(node.typeArguments);
  } else if (typescript.isNewExpression(expression)) {
    arguments = getArguments(expression.arguments);
    typeArguments = getTypeArguments(expression.typeArguments);
  }

  return {
    arguments,
    expression: name.text,
    typeArguments,
  };
}

exports.default = parseCallExpression;
