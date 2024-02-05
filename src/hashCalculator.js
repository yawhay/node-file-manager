import fs from 'fs';
import crypto from 'crypto';
import { getClearFilePath, isFileExistByPath } from './utils.js';

async function hash (currentPath, [filePath], callback) {
  if (!filePath) {
    return callback(`1 arguments must be specified: path to file is required`);
  }

  const path = getClearFilePath(currentPath, filePath);

  if (!await isFileExistByPath(path)) {
    return callback(`Doesn't exist file in path ${path}`);
  }

  const readStream = fs.createReadStream(path);

  const hash = crypto.createHash('sha256');

  readStream.on('data', (chunk) => {
    hash.update(chunk);
  });

  readStream.on('end', () => {
    const hashResult = hash.digest('hex');

    console.log('File Hash (SHA-256):', hashResult);
    callback(null);
  });
}

export { hash }