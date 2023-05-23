const typescript = require('typescript');
const parseCallExpression = require('./parseCallExpression').default;
const parseVariableDeclaration = require('./parseVariableDeclaration').default;

function traverse(node) {
  const variableStatements = node.statements.filter(statement => typescript.isVariableStatement(statement));
  const expressionStatements = node.statements.filter(
    statement => typescript.isExpressionStatement(statement) && typescript.isCallExpression(statement.expression)
  );

  return {
    expressionStatements: expressionStatements.map(statement => ({
      callExpression: parseCallExpression(statement.expression),
    })),
    variableStatements: variableStatements.map(statement =>
      parseVariableDeclaration(statement.declarationList.declarations[0])
    ),
  };
}

exports.default = traverse;
