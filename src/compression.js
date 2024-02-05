import zlib from 'zlib';
import fs from 'fs';
import { getClearFileName, getClearFilePath, isFileExistByPath } from './utils.js';

async function compress (currentPath, [filePath, destinationPath], callback) {
  if (!filePath || !destinationPath) {
    return callback(`2 arguments must be specified: File path and Name or Archive path required`);
  }

  const sourcePath = getClearFilePath(currentPath, filePath);
  const destinationClearPath = getClearFilePath(currentPath, destinationPath)
  const fileName = getClearFileName(sourcePath);

  if (!await isFileExistByPath(sourcePath)) {
    return callback(`Doesn't exist source file in path ${sourcePath}`);
  }

  const destinationPathWithBR = destinationClearPath.split('.').at(-1) === 'br'
    ? destinationClearPath
    : destinationClearPath + '.br';

  if (await isFileExistByPath(destinationPathWithBR)) {
    return callback(`File ${fileName} in path ${destinationPath} already exist`);
  }

  const readStream = fs.createReadStream(sourcePath);
  const writeStream = fs.createWriteStream(destinationPathWithBR);

  const gzip = zlib.createBrotliCompress();

  await readStream.pipe(gzip).pipe(writeStream);

  console.log(`File saved ${destinationPathWithBR}`)
  callback();
}

async function decompress (currentPath, [filePath, destinationPath], callback) {
  if (!filePath || !destinationPath) {
    return callback(`2 arguments must be specified: The path to file and destination path are required`);
  }

  if (destinationPath.split('.').length < 2) {
    console.log(`file extension must be specified`);
  }

  const sourcePath = getClearFilePath(currentPath, filePath);
  const destinationClearPath = getClearFilePath(currentPath, destinationPath)

  if (!await isFileExistByPath(sourcePath)) {
    return callback(`Doesn't exist source file in path ${sourcePath}`);
  }

  const readStream = fs.createReadStream(sourcePath);
  const writeStream = fs.createWriteStream(destinationClearPath);

  const gzip = zlib.createBrotliDecompress();

  await readStream.pipe(gzip).pipe(writeStream);

  console.log(`File saved ${destinationClearPath}`)
  callback();
}

export { compress, decompress }