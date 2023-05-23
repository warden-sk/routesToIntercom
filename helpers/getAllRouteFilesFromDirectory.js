const File = require('../../helpers/File').default;
const getDirectoryTree = require('../../helpers/getDirectoryTree').default;

async function getAllRouteFilesFromDirectory(directoryPath, onRouteFile) {
  const directoryTree = await getDirectoryTree(directoryPath);

  async function traverseTree($) {
    if ($.children && $.children.length > 0) {
      for (const child of $.children) {
        await traverseTree(child);
      }
    }

    if ($.type === 'file') {
      if (!/\.test\.ts/.test($.path)) {
        const routeFile = await new File($.path).readFile();

        onRouteFile(routeFile, $.path);
      }
    }
  }

  await traverseTree(directoryTree);
}

exports.default = getAllRouteFilesFromDirectory;
