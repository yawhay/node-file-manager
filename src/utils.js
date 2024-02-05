import fs from 'fs';

/**
 * Get clear path without "/"
 * @param path
 * @returns {*}
 */
export function getPathWithoutLastSlash (path) {
  return path.at(-1) === '/'
    ? path.slice(0, -1)
    : path;
}

/**
 * Get path without extra "/"
 * @param currentPath
 * @param filePath
 * @returns {*|string}
 */
export function getClearFilePath (currentPath, filePath) {
  const currentPathWithoutLastSlash = getPathWithoutLastSlash(currentPath);
  const filePathWithoutLastSlash = getPathWithoutLastSlash(filePath);

  if (filePathWithoutLastSlash[0] === '/') {
    // absolute way
    return filePathWithoutLastSlash;
  }

  return currentPathWithoutLastSlash + '/' + filePathWithoutLastSlash
}

/**
 * Get clear file name
 * @param filePath
 * @returns {unknown}
 */
export function getClearFileName (filePath) {
  const pathWithoutLastSlash = getPathWithoutLastSlash(filePath);

  if (pathWithoutLastSlash.indexOf('/') === -1) {
    return pathWithoutLastSlash;
  }

  return pathWithoutLastSlash.split('/').at(-1);
}

/**
 * Check file existing
 * @returns {Promise<boolean>}
 * @param path
 */
export async function isFileExistByPath (path) {
  try {
    const stats = await fs.promises.stat(path);
    return stats.isFile();
  } catch (e) {
    return false
  }
}

/**
 * Check folder existing
 * @returns {Promise<boolean>}
 * @param path
 */
export async function isDirExistByPath (path) {
  try {
    const stats = await fs.promises.stat(path);
    return stats.isDirectory();
  } catch (e) {
    return false
  }
}