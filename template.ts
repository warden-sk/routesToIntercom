/*
 * Copyright 2023 Marek Kobida
 */

import getRequestFunction from './functions/getRequestFunction';
import getSendRequestFunction from './functions/getSendRequestFunction';

function template(text: string, types: string): string {
  return `/*
 * Copyright 2023 Marek Kobida
 */

import IFrame from '@intercom/IFrame';
import React from 'react';
import type { CategoryRow } from '@intercom/types';
import type { ConversationMessageRow } from '@intercom/types';
import type { ConversationRow } from '@intercom/types';
import type { CountryRow } from '@intercom/types';
import type { MailRow } from '@intercom/types';
import type { TransformedAccountRow } from '@intercom/types';
import type { TransformedApplicationRow } from '@intercom/types';
import type { TransformedApplicationVersionRow } from '@intercom/types';
import type { TransformedConversationMessageRow } from '@intercom/types';

export interface GetRequestOptions {
  abortController: AbortController;
  body?: string;
  method?: string;
  parameters?: { [parameterName: string]: string | undefined };
  url: string;
}

export interface IntercomHistoryRow {
  id: number;
  latency?: number;
  request: Request;
  response?: unknown;
  state: number;
}

export interface IntercomState {
  clientVersion?: string;
  history: IntercomHistoryRow[];
  latencies: number[];
  latency: number;
}

${types}

class Intercom {
  IFrame = new IFrame();

  readonly UPDATED_AT = ${+new Date()};
  readonly VERSION = '2.0.0+${+new Date()}';

  #clientVersion?: string;
  #history: IntercomHistoryRow[] = [];

  constructor(public setIntercomState: (intercomState: IntercomState) => void) {
    console.log('[Intercom]', this.VERSION);
  }

${text}

${getRequestFunction()}

${getSendRequestFunction()}

  #update() {
    const latencies = this.#history.reduce<number[]>((n, { latency }) => (latency ? [...n, latency] : n), []);

    const latency = latencies.reduce((n, latency) => n + latency, 0) / latencies.length;

    this.setIntercomState({ clientVersion: this.#clientVersion, history: this.#history, latencies, latency });
  }

  #use<T>(url: string): T {
    const [error, setError] = React.useState<{ message: string; name: string }>();
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    const abortController = new AbortController();

    // @ts-ignore
    const $ = async (parameters, method, body) => {
      const request = this.#getRequest({ abortController, body, method, parameters, url });

      setIsFetching(true);

      return this.#sendRequest(...request).then(
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
  }
}

export default Intercom;
`;
}

export default template;
