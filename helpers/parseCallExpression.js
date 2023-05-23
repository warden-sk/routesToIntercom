const typescript = require('typescript');
const invariant = require('../../helpers/invariant').default;
const parseArguments = require('./parseArguments').default;

function parseCallExpression(node) {
  const parsedArguments = node.arguments.map(argument => parseArguments(argument));

  invariant(
    typescript.isPropertyAccessExpression(node.expression),
    '`CallExpression` expression is not an `PropertyAccessExpression`'
  );

  const { expression, name } = node.expression;

  if (typescript.isIdentifier(expression)) {
    const typeArguments = node.typeArguments || [];

    const parsedTypeArguments = typeArguments.flatMap(typeArgument =>
      typescript.isTypeLiteralNode(typeArgument) ? typeArgument.members.map(member => parseArguments(member)) : []
    );

    return {
      arguments: parsedArguments,
      expression: `${expression.text}.${name.text}`,
      typeArguments: parsedTypeArguments,
    };
  }

  if (typescript.isNewExpression(expression)) {
    const typeArguments = expression.typeArguments || [];

    const parsedTypeArguments = typeArguments.flatMap(typeArgument =>
      typescript.isTypeLiteralNode(typeArgument) ? typeArgument.members.map(member => parseArguments(member)) : []
    );

    return {
      arguments: expression.arguments.map(argument => parseArguments(argument)),
      expression: `${name.text}`,
      typeArguments: parsedTypeArguments,
    };
  }

  // error
}

exports.default = parseCallExpression;
