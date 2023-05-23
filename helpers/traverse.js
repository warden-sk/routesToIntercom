const typescript_1 = require('typescript');
const parseCallExpression_1 = require('./parseCallExpression').default;
const parseVariableDeclaration_1 = require('./parseVariableDeclaration').default;
function traverse(node) {
  const variableStatements = node.statements.filter(statement => typescript_1.isVariableStatement(statement));
  const expressionStatements = node.statements.filter(
    statement => typescript_1.isExpressionStatement(statement) && typescript_1.isCallExpression(statement.expression)
  );
  return {
    //@ts-ignore
    expressionStatements: expressionStatements.map(statement => ({
      //@ts-ignore
      callExpression: parseCallExpression_1(statement.expression),
    })),
    variableStatements: variableStatements.map(statement =>
      parseVariableDeclaration_1(statement.declarationList.declarations[0])
    ),
  };
}
exports.default = traverse;
