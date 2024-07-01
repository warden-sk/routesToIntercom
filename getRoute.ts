/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 01.07.2024
 */

import invariant from '@helpers/validation/invariant';
import messages from './messages';
import parseCallExpression from './parsing/parseCallExpression';
import ts from 'typescript';
import typeAsText from './typeAsText';

type GetRouteOutput = {
  httpMethod: string;
  httpResponseType: string;
};

function getRoute(expressionStatement: ts.ExpressionStatement): GetRouteOutput {
  invariant(ts.isCallExpression(expressionStatement.expression), messages.EXPECTED_ARGUMENT_TO_BE_CALL_EXPRESSION);

  const parsedCallExpression = parseCallExpression(expressionStatement.expression);

  /**
   * router.createAuthorizedRoute('GET', PATTERN, () => {});
   *                              |      |        |
   *                             (1)    (2)      (3)
   */
  invariant(parsedCallExpression.arguments.length === 3, messages.EXPECTED_THREE_ARGUMENTS_IN_CALL_EXPRESSION);

  const [firstArgument, , thirdArgument] = parsedCallExpression.arguments;

  invariant(firstArgument!.kind === 'StringLiteral', messages.EXPECTED_FIRST_ARGUMENT_TO_BE_STRING_LITERAL);
  invariant(thirdArgument!.kind === 'ArrowFunction', messages.EXPECTED_THIRD_ARGUMENT_TO_BE_ARROW_FUNCTION);

  const httpMethod = firstArgument.text;

  const httpResponseType =
    thirdArgument.type?.kind === 'TypeReference' ? thirdArgument.type.typeArguments.map(typeAsText)[0]! : 'void';

  return { httpMethod, httpResponseType };
}

export type { GetRouteOutput };

export default getRoute;
