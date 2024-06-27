/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

import invariant from '@helpers/validation/invariant';
import messages from './messages';
import parseCallExpression from './parsing/parseCallExpression';
import type ts from 'typescript';
import typeAsText from './typeAsText';

type GetRouteOutput = {
  httpMethod: string;
  httpResponseType: string;
  isAuthorizedRoute: boolean;
};

function getRoute(callExpression: ts.CallExpression): GetRouteOutput {
  const parsedCallExpression = parseCallExpression(callExpression);

  /**
   * router.createAuthorizedRoute('GET', PATTERN, () => {});
   *                              |      |        |
   *                             (1)    (2)      (3)
   */
  invariant(parsedCallExpression.arguments.length === 3, messages.EXPECTED_THREE_ARGUMENTS_IN_CALL_EXPRESSION);

  const [$1st, , $3rd] = parsedCallExpression.arguments;

  invariant($1st!.kind === 'StringLiteral', messages.EXPECTED_FIRST_ARGUMENT_TO_BE_STRING_LITERAL);
  invariant($3rd!.kind === 'ArrowFunction', messages.EXPECTED_THIRD_ARGUMENT_TO_BE_ARROW_FUNCTION);

  const httpMethod = $1st.text;
  const httpResponseType = $3rd.type?.kind === 'TypeReference' ? $3rd.type.typeArguments.map(typeAsText)[0]! : 'void';
  const isAuthorizedRoute = parsedCallExpression.name === 'createAuthorizedRoute';

  return { httpMethod, httpResponseType, isAuthorizedRoute };
}

export type { GetRouteOutput };

export default getRoute;
