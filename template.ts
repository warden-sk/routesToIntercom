/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 27.06.2024
 */

import getRequestFunction from './functions/getRequestFunction';
import getSendRequestFunction from './functions/getSendRequestFunction';
import getTransformUrlFunction from './functions/getTransformUrlFunction';
import getUpdateFunction from './functions/getUpdateFunction';
import getUseFunction from './functions/getUseFunction';

function template(functionDefinitions: string, typeDefinitions: string): string {
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

type GetRequestInput = {
  abortController?: AbortController;
  body?: ReadableStream | string;
  method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  parameters?: Record<string, string | undefined>;
  url: string;
};

type GetRequestOutput = [Request, number];

type IntercomHistoryRow = {
  id: number;
  latency?: number;
  request: Request;
  response?: unknown;
  state: number;
};

type IntercomState = {
  clientVersion?: string;
  history: IntercomHistoryRow[];
  latencies: number[];
  latency: number;
};

${typeDefinitions}

class Intercom {
  IFrame = new IFrame();

  readonly UPDATED_AT = ${+new Date()};
  readonly VERSION = '3.0.0+${+new Date()}';

  #clientVersion?: string;
  #history: IntercomHistoryRow[] = [];

  constructor(public setIntercomState: (intercomState: IntercomState) => void) {
    console.log('[Intercom]', this.UPDATED_AT, this.VERSION);
  }

${functionDefinitions}

${getRequestFunction()}

${getSendRequestFunction()}

${getTransformUrlFunction()}

${getUpdateFunction()}

${getUseFunction()}
}

export type { GetRequestInput, GetRequestOutput, IntercomHistoryRow, IntercomState };

export default Intercom;
`;
}

export default template;
