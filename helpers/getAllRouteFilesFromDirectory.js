const File_1 = require('../../helpers/File').default;
const getDirectoryTree_1 = require('../../helpers/getDirectoryTree').default;
async function getAllRouteFilesFromDirectory(directoryPath, onRouteFile) {
  const directoryTree = await getDirectoryTree_1(directoryPath);
  async function traverseTree($) {
    if ($.children && $.children.length > 0) {
      for (const child of $.children) {
        await traverseTree(child);
      }
    }
    if ($.type === 'file') {
      if (!/(\.test\.ts|index\.ts)/.test($.path)) {
        const routeFile = await new File_1($.path).readFile();
        onRouteFile(routeFile, $.path);
      }
    }
  }
  await traverseTree(directoryTree);
}
exports.default = getAllRouteFilesFromDirectory;
