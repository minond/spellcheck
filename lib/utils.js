const { lstat, readFile } = require("node:fs/promises");

/**
 * @param {Array<String>} paths
 * @return {Boolean}
 */
async function allFiles(paths) {
  const stats = await Promise.all(paths.map((path) => lstat(path)));
  return stats.reduce((allFiles, stat) => allFiles && stat.isFile(), true);
}

/**
 * @param {Array<String>} paths
 * @return {Array<String>}
 */
async function readAll(paths) {
  return Promise.all(
    paths.map((path) => readFile(path, { encoding: "utf-8" })),
  );
}

module.exports = { allFiles, readAll };
