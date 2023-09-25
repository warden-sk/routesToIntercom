/*
 * Copyright 2023 Marek Kobida
 */

import type { DirectoryTree } from '@helpers/getDirectoryTree';
import getDirectoryTree from '@helpers/getDirectoryTree';

async function getAllRouteFilesFromDirectory(directoryPath: string, onRouteFile: (routeFilePath: string) => void) {
  const directoryTree = await getDirectoryTree(directoryPath);

  async function traverseTree($: DirectoryTree) {
    if ($.children) {
      for (const child of $.children) {
        await traverseTree(child);
      }
    }

    if ($.type === 'file') {
      if (!/(\.test|index)\.ts/.test($.path)) {
        onRouteFile($.path);
      }
    }
  }

  await traverseTree(directoryTree!);
}

export default getAllRouteFilesFromDirectory;
