/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 01.07.2024
 */

import assert from 'node:assert';
import parseFile from '../parsing/parseFile';
import test from 'node:test';

test('(1) parseFile', async () => {
  const parsedFile = await parseFile('/Users/marekkobida/Documents/warden/leopold/routesToIntercom/tests/01-file.ts');

  assert.deepStrictEqual(parsedFile, {
    fileName: '01-file',
    pattern: { parameters: [], url: 'https://server.redred.app/product' },
    routes: [{ httpMethod: 'GET', httpResponseType: 'void' }],
  });
});

test('(2) parseFile', async () => {
  const parsedFile = await parseFile('/Users/marekkobida/Documents/warden/leopold/routesToIntercom/tests/02-file.ts');

  assert.deepStrictEqual(parsedFile, {
    fileName: '02-file',
    pattern: {
      parameters: [
        ['id', '?: string'],
        ['language', ': string'],
      ],
      url: 'https://server.redred.app/:language/product/:id?',
    },
    routes: [{ httpMethod: 'DELETE', httpResponseType: 'void' }],
  });
});

test('(3) parseFile', async () => {
  const parsedFile = await parseFile('/Users/marekkobida/Documents/warden/leopold/routesToIntercom/tests/03-file.ts');

  assert.deepStrictEqual(parsedFile, {
    fileName: '03-file',
    pattern: { parameters: [['id', ': string']], url: 'https://server.redred.app/product/:id' },
    routes: [{ httpMethod: 'GET', httpResponseType: 'string' }],
  });
});
