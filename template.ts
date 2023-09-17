/*
 * Copyright 2023 Marek Kobida
 */

import getRequestFunction from './functions/getRequestFunction';
import getSendRequestFunction from './functions/getSendRequestFunction';

function template(text: string): string {
  return `/*
 * Copyright 2023 Marek Kobida
 */

import React from 'react';
import type { CategoryRow } from '@intercom/types';
import type { ConversationMessageRow } from '@intercom/types';
import type { ConversationRow } from '@intercom/types';
import type { CountryRow } from '@intercom/types';
import type { TransformedAccountRow } from '@intercom/types';
import type { TransformedApplicationRow } from '@intercom/types';
import type { TransformedApplicationVersionRow } from '@intercom/types';
import type { TransformedConversationMessageRow } from '@intercom/types';
import Σ from '@helpers/Σ';

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

class Intercom {
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
    const latencies = this.#history.reduce<number[]>(($, { latency }) => (latency ? [...$, latency] : $), []);

    Σ(
      latencies.reduce((n, latency) => n + latency, 0),
      n => n / latencies.length,
      n => this.setIntercomState({ clientVersion: this.#clientVersion, history: this.#history, latencies, latency: n })
    );
  }
}

export default Intercom;
`;
}

export default template;
