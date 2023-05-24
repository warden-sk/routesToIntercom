const File = require('../helpers/File').default;
const getAllRouteFilesFromDirectory = require('./helpers/getAllRouteFilesFromDirectory').default;
const getAsyncFunction = require('./functionAsText/getAsyncFunction').default;
const getRequest = require('./functionAsText/getRequest').default;
const traverse = require('./helpers/traverse').default;
const typescript = require('typescript');

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
      return `{ ${$.of.map(member => `${member.text}: ${typeToString(member.of)}`).join('; ')} }`;
    case 'TypeReference':
      return $.text;
    case 'UnionType':
      return $.of.map(typeToString).join(' | ');
    default:
      return $.kind;
  }
};

let text = `import type { Account } from '../../server/storages/AccountStorage';
import type { Category } from '../../server/storages/CategoryStorage';
import type { TransformedApplication } from '../../server/transformers/transformApplication';
import type { TransformedApplicationVersion } from '../../server/transformers/transformApplicationVersion';

class Intercom {
  static VERSION = '1.0.0+${+new Date()}';

`;

(async () => {
  await getAllRouteFilesFromDirectory(
    '/Users/marekkobida/Documents/warden/leopold/server/routes',
    (routeFile, routeFilePath) => {
      const [, fileName] = /([^/]+)\.ts$/.exec(routeFilePath);

      const sourceFile = typescript.createSourceFile(
        routeFilePath,
        routeFile.toString(),
        typescript.ScriptTarget.ESNext,
        true
      );

      const traverseOutput = traverse(sourceFile);

      const pattern = traverseOutput.variableStatements[0];
      const patternArguments = pattern.arguments;
      const patternExpression = pattern.expression;
      const patternTypeArguments = pattern.typeArguments;

      const route = traverseOutput.expressionStatements[0];
      const routeArguments = route.arguments;

      let routeUrl = patternExpression;
      if (/ApplicationRoutePattern/.test(routeUrl)) {
        routeUrl = 'https://leopold-application.warden.sk' + patternArguments[0].text;
      } else if (/ServerRoutePattern/.test(routeUrl)) {
        routeUrl = 'https://leopold-server.warden.sk' + patternArguments[0].text;
      }

      const routeMethod =
        traverseOutput.expressionStatements.length > 1
          ? traverseOutput.expressionStatements.map(callExpression => callExpression.arguments[0].text)
          : routeArguments[0].text;

      const routeName = fileName;

      const rAWithTypes = patternTypeArguments
        ? patternTypeArguments
            .map(argument => {
              const questionToken = argument.hasQuestionToken ? '?' : '';

              return `${argument.text}${questionToken}: ${typeToString(argument)}`;
            })
            .join(', ')
        : '';

      const rAWithoutTypes = patternTypeArguments ? patternTypeArguments.map(argument => argument.text).join(', ') : '';

      const rT = routeArguments[2].typeArguments.map(typeToString).join('');

      text += getAsyncFunction({
        arguments: [rAWithTypes, rAWithoutTypes],
        method: routeMethod,
        name: routeName,
        type: rT || 'void',
        url: routeUrl,
      });

      text += '\n';
    }
  );

  text += getRequest();
  text += `}

export default Intercom;
`;

  new File('./public/Intercom.ts').writeFile(text);
})();
