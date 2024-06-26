/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 26.06.2024
 */

import getRequestFunction from './functions/getRequestFunction';
import getSendRequestFunction from './functions/getSendRequestFunction';
import getUseFunction from './functions/getUseFunction';
import getUpdateFunction from './functions/getUpdateFunction';

function template(text: string, types: string): string {
  return `/*
 * Copyright 2024 Marek Kobida
 */

import IFrame from '@intercom/IFrame';
import React from 'react';
import type {
  CategoryRow,
  ConversationRow,
  CountryRow,
  DirectoryRow,
  FileRow,
  MailRow,
  TransformedAccountRow,
  TransformedApplicationRow,
  TransformedApplicationVersionRow,
  TransformedConversationMessageRow,
  TransformedMailCampaignRow,
} from '@intercom/types';

export type GetRequestInput = {
  abortController?: AbortController;
  body?: ReadableStream;
  method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  parameters?: Record<string, string | undefined>;
  url: string;
};

export type GetRequestOutput = [Request, number];

export type IntercomHistoryRow = {
  id: number;
  latency?: number;
  request: Request;
  response?: unknown;
  state: number;
};

export type IntercomState = {
  clientVersion?: string;
  history: IntercomHistoryRow[];
  latencies: number[];
  latency: number;
};

${types}

class Intercom {
  IFrame = new IFrame();

  readonly UPDATED_AT = ${+new Date()};
  readonly VERSION = '3.0.0+${+new Date()}';

  clientVersion?: string;
  history: IntercomHistoryRow[] = [];

  constructor(public setIntercomState: (intercomState: IntercomState) => void) {
    console.log('[Intercom]', this.UPDATED_AT, this.VERSION);
  }

${text}

${getRequestFunction()}

${getSendRequestFunction()}

${getUpdateFunction()}

${getUseFunction()}
}

export default Intercom;
`;
}

export default template;
