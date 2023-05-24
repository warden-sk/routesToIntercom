const parseCallExpression = require('./parseCallExpression').default;
const parseVariableDeclaration = require('./parseVariableDeclaration').default;
const typescript = require('typescript');

function traverse(node) {
  const expressionStatements = node.statements
    .filter(
      statement => typescript.isExpressionStatement(statement) && typescript.isCallExpression(statement.expression)
    )
    .map(statement => parseCallExpression(statement.expression));

  const variableStatements = node.statements
    .filter(statement => typescript.isVariableStatement(statement))
    .map(statement => parseVariableDeclaration(statement.declarationList.declarations[0]));

  return {
    expressionStatements,
    variableStatements,
  };
}

exports.default = traverse;
