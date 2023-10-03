/*
 * Copyright 2023 Marek Kobida
 */

import type { DirectoryTree } from '@helpers/getDirectoryTree';
import getDirectoryTree from '@helpers/getDirectoryTree';

// dokončiť toto je súbor ktorý som nekontroloval
async function getAllRouteFilesFromDirectory(directoryPath: string): Promise<string[]> {
  const output: string[] = [];

  const directoryTree = await getDirectoryTree(directoryPath);

  async function traverseTree($: DirectoryTree) {
    if ($.children) {
      for (const child of $.children) {
        await traverseTree(child);
      }
    }

    if ($.type === 'file') {
      if (!/(\.test|index)\.ts/.test($.path)) {
        output.push($.path);
      }
    }
  }

  await traverseTree(directoryTree!);

  return output;
}

export default getAllRouteFilesFromDirectory;
