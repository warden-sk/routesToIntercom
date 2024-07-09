/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 09.07.2024
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
import type {
  CategoryRow,
  CountryRow,
  DirectoryRow,
  FileRow,
  MailRow,
  TransformedAccountRow,
  TransformedApplicationRow,
  TransformedApplicationVersionRow,
  TransformedMailCampaignRow,
} from '@intercom/types';
import React from 'react';

type GetRequestInput = {
  abortController?: AbortController;
  body?: ArrayBuffer | Blob | string;
  method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  parameters?: Record<string, string | undefined>;

  url: string;
};

type GetRequestOutput = [request: Request, requestId: number];

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

/* —————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

type T = {
  abort: () => void;
  error?: { message: string; name: string };
  isFetching: boolean;
};

${typeDefinitions}

/* —————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

class Intercom {
  IFrame = new IFrame();

  readonly UPDATED_AT = ${+new Date()};
  readonly VERSION = '3.0.0+${+new Date()}';

  #clientVersion?: string;
  #history: IntercomHistoryRow[] = [];

  constructor(private setIntercomState: (intercomState: IntercomState) => void) {
    console.log('[Intercom]', this.UPDATED_AT, this.VERSION);
  }

  /* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

${functionDefinitions}

  /* ———————————————————————————————————————————————————————————————————————————————————————————————————————————————— */

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
