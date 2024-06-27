/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

function getUseFunction(): string {
  return `  #use<T>(url: string): T {
    const [error, setError] = React.useState<{ message: string; name: string }>();
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    const abortController = new AbortController();

    const $ = async (
      parameters?: GetRequestInput['parameters'],
      method?: GetRequestInput['method'],
      body?: GetRequestInput['body'],
    ) => {
      const [request, requestId] = this.#getRequest({ abortController, body, method, parameters, url });

      abortController.signal.addEventListener('abort', () => {
        this.#history = this.#history.map(row =>
          row.id === requestId ? { ...row, state: row.latency ? row.state : 2 } : row,
        );

        this.#update();
      });

      setIsFetching(true);

      return this.#sendRequest(request, requestId).then(
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

    return $ as T;
  }`;
}

export default getUseFunction;
