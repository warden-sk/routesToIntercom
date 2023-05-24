/*
 * Copyright 2023 Marek Kobida
 */

const File = require('../helpers/File').default;
const getAllRouteFilesFromDirectory = require('./helpers/getAllRouteFilesFromDirectory').default;
const getAsyncFunction = require('./functionAsText/getAsyncFunction').default;
const getRequestFunction = require('./functionAsText/getRequestFunction').default;
const traverse = require('./helpers/traverse').default;
const typeAsText = require('./helpers/typeAsText').default;
const typescript = require('typescript');

let text = `/*
 * Copyright 2023 Marek Kobida
 */

import type { Account } from '../../server/storages/AccountStorage';
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
        typescript.ScriptTarget.ESNext
      );

      const traverseOutput = traverse(sourceFile);

      const pattern = traverseOutput.variableStatements[0];
      const patternArguments = pattern.arguments;
      const patternExpression = pattern.expression;
      const patternTypeArguments = pattern.typeArguments;

      const route = traverseOutput.expressionStatements[0];
      const routeArguments = route.arguments;

      const routeMethod =
        traverseOutput.expressionStatements.length > 1
          ? traverseOutput.expressionStatements.map(callExpression => callExpression.arguments[0].text)
          : routeArguments[0].text;

      const routeName = fileName;

      let routeUrl = patternExpression;
      if (/ApplicationRoutePattern/.test(routeUrl)) {
        routeUrl = 'https://leopold-application.warden.sk' + patternArguments[0].text;
      } else if (/ServerRoutePattern/.test(routeUrl)) {
        routeUrl = 'https://leopold-server.warden.sk' + patternArguments[0].text;
      }

      const rAWithTypes = patternTypeArguments
        ? patternTypeArguments
            .map(argument => {
              const questionToken = argument.hasQuestionToken ? '?' : '';

              return `${argument.text}${questionToken}: ${typeAsText(argument)}`;
            })
            .join(', ')
        : '';

      const rAWithoutTypes = patternTypeArguments ? patternTypeArguments.map(argument => argument.text).join(', ') : '';

      const rT = routeArguments[2].typeArguments.map(typeAsText).join('');

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

  text += getRequestFunction();
  text += `}

export default Intercom;
`;

  await new File('./public/Intercom.ts').writeFile(text);
})();
