const typescript_1 = require('typescript');
const getAsyncFunction_1 = require('./functionAsText/getAsyncFunction').default;
const getRequest_1 = require('./functionAsText/getRequest').default;
const getAllRouteFilesFromDirectory_1 = require('./helpers/getAllRouteFilesFromDirectory').default;
const traverse_1 = require('./helpers/traverse').default;
const typeToString = $ => {
  switch ($.kind) {
    case 'ArrayType':
      return `${typeToString($.of)}[]`;
    case 'LiteralType':
      return $.text;
    case 'PropertySignature':
      return typeToString($.of);
    case 'StringKeyword':
      return 'string';
    case 'TypeLiteral':
      return `{ ${$.of.map(typePart => `${typePart.text}: ${typeToString(typePart.of)}`).join(', ')} }`;
    case 'TypeReference':
      return $.text;
    case 'UnionType':
      const unionTypeParts = $.of.map(typePart => typeToString(typePart));
      return unionTypeParts.join(' | ');
    default:
      return $.kind;
  }
};
let text = '';
text += `import report from '../../helpers/report';
import type { Account } from '../../server/storages/AccountStorage';
import type { Category } from '../../server/storages/CategoryStorage';
import type { TransformedApplication } from '../../server/transformers/transformApplication';
import type { TransformedApplicationVersion } from '../../server/transformers/transformApplicationVersion';
class Intercom {
`;
(async () => {
  await getAllRouteFilesFromDirectory_1(
    '/Users/marekkobida/Documents/warden/leopold/server/routes',
    (routeFile, routeFilePath) => {
      const sourceFile = typescript_1.createSourceFile(
        routeFilePath,
        routeFile.toString(),
        typescript_1.ScriptTarget.ESNext,
        true
      );
      const traverseOutput = traverse_1(sourceFile);
      const hasMoreRoutes = traverseOutput.expressionStatements.length > 0;
      const pattern = traverseOutput.variableStatements[0];
      const patternArguments = pattern.callExpression.arguments;
      const patternExpression = pattern.callExpression.expression;
      const patternTypeArguments = pattern.callExpression.typeArguments;
      const route = traverseOutput.variableStatements[1];
      const routeArguments = route.callExpression.arguments;
      let routeUrl = patternExpression;
      if (/ApplicationRoutePattern/.test(routeUrl)) {
        routeUrl = 'https://leopold-application.warden.sk' + patternArguments[0].text;
      } else if (/ServerRoutePattern/.test(routeUrl)) {
        routeUrl = 'https://leopold-server.warden.sk' + patternArguments[0].text;
      }
      const routeMethod = routeArguments[0].text;
      const routeName = route.name;
      const rAWithTypes =
        patternTypeArguments.length > 0
          ? patternTypeArguments.reduce(($, patternType, i) => {
              const questionToken = patternType.hasQuestionToken ? '?' : '';
              return `${$}${i === 0 ? '' : ', '}${patternType.text}${questionToken}: ${typeToString(patternType)}`;
            }, '')
          : '';
      const rAWithoutTypes =
        patternTypeArguments.length > 0
          ? patternTypeArguments.reduce(($, patternType, i) => {
              return `${$}${i === 0 ? '' : ', '}${patternType.text}`;
            }, '')
          : '';
      const rT = routeArguments[2].typeArguments.reduce((accumulator, currentType) => {
        return (accumulator += typeToString(currentType));
      }, '');
      text += getAsyncFunction_1({
        arguments: [rAWithTypes, rAWithoutTypes],
        hasMoreRoutes,
        method: routeMethod,
        name: routeName,
        type: rT || 'void',
        url: routeUrl,
      });
    }
  );
  text += getRequest_1();
  text += `}
export default Intercom;
`;
  process.stdout.write(text);
})();
