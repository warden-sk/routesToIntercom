/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 26.06.2024
 */

function getUseFunction(): string {
  return `  #use<ResponseType>(url: string): ResponseType {
    const [error, setError] = React.useState<{ message: string; name: string }>();
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    const abortController = new AbortController();

    // @ts-ignore
    const $ = async (parameters, method, body) => {
      const [request, requestId] = this.getRequest({ abortController, body, method, parameters, url });

      setIsFetching(true);

      return this.sendRequest(request, requestId).then(
        response => {
          setIsFetching(false);

          return response;
        },
        error => {
          setError(error);
          setIsFetching(false);

          throw error;
        },
      );
    };

    $.abort = () => abortController.abort();
    $.error = error;
    $.isFetching = isFetching;

    return $ as ResponseType;
  }`;
}

export default getUseFunction;
