import fs from 'fs';
import {
  getClearFileName,
  getClearFilePath,
  getPathWithoutLastSlash,
  isDirExistByPath,
  isFileExistByPath
} from './utils.js';

async function up (currentPath, _, callback) {
  try {
    const newPath = currentPath.split('/').slice(0, -1).join('/');
    const list = await fs.promises.readdir(newPath, {})

    if (list.length) {
      callback(null, newPath)
    }
  } catch (e) {
    return callback('You are in the root directory');
  }
}

async function cd (currentPath, [pathToDirectory], callback) {
  if (!pathToDirectory) {
    callback('1 argument must be specified: The path to directory is a required');
  }
  const clearPathToDirectory = getPathWithoutLastSlash(pathToDirectory)
  const transitions = clearPathToDirectory.split('/');

  let newPath = currentPath;

  for (const transition of transitions) {
    switch (transition) {
      case '.':
        break;
      case '':
        newPath = ''
        break;
      case '..':
        await up(newPath, [], (err, path) => {
          newPath = path;
        });
        break;
      default:
        try {
          if (await isDirExistByPath(newPath + '/' + transition)) {
            newPath = newPath + '/' + transition;
          }
        } catch (e) {
          return callback(`Warn! Directories ${transition} doesn't exist in ${newPath}`, currentPath);
        }
        break;
    }
  }

  callback(null, newPath)
}

async function ls (currentPath, _, callback) {
  try {
    const list = await fs.promises.readdir(currentPath, { withFileTypes: true });

    const directories = [];
    const files = [];

    list.forEach(file => {
      if (file.isDirectory()) {
        directories.push({
          name: file.name,
          type: 'directory',
        });
      } else {
        files.push({
          name: file.name,
          type: 'file',
        });
      }
    })

    const sortedDirectories = directories.sort();
    const sortedFiles = files.sort();
    const filesList = sortedDirectories.concat(sortedFiles);

    console.table(filesList)

    callback(null)
  } catch (e) {
    callback(e)
  }
}

async function cat (currentPath, [filePath], callback) {
  if (!filePath) {
    callback('1 argument must be specified: the path to file is a required');
  }

  const clearPath = getClearFilePath(currentPath, filePath);
  const path = getClearFilePath(currentPath, filePath);

  if (!await isFileExistByPath(clearPath)) {
    return callback(`File doesn't exist in path: ${path}`);
  }

  const readableStream = fs.createReadStream(path, { encoding: 'utf-8' });

  readableStream.on('readable', () => {
    let chunk;
    while ((chunk = readableStream.read()) !== null) {
      console.log(chunk);
    }
  });

  readableStream.on('end', () => {
    console.log('\n');
    callback()
  });

  readableStream.on('error', (_) => {
    callback(`Failed to read file in path: ${path}`);
  });
}

async function add (currentPath, [fileName], callback) {
  if (!fileName) {
    callback('1 argument must be specified: the file name is a required');
  }
  const path = getClearFilePath(currentPath, fileName);

  if (await isFileExistByPath(path)) {
    callback(`File already exists in path ${path}`);
    return;
  }

  fs.writeFile(path, '', (err) => {
    if (err) {
      callback(`Failed to create file in path: ${path}`);
    } else {
      console.log(`File created successful in path ${path}`);
      callback(null);
    }
  });
}

async function rn (currentPath, [filePath, newFilename], callback) {
  if (!filePath || !newFilename) {
    callback('2 arguments must be specified: the path to file and new file name are required');
  }

  const path = getClearFilePath(currentPath, filePath);
  const newFilePath = path.split('/').slice(0, -1).join('/') + '/' + newFilename;

  if (!await isFileExistByPath(path)) {
    return callback(`File doesn't exist in ${path}`);
  }

  fs.rename(path, newFilePath, (err) => {
    if (err) {
      callback(`Failed to rename file in path: ${path} to ${newFilePath}`)
    } else {
      console.log(`File renamed successful from path ${filePath} to ${newFilename}`);
      callback(null);
    }
  })
}

async function cp (currentPath, [filePath, newDirectoryPath], callback) {
  if (!filePath || !newDirectoryPath) {
    return callback(`2 arguments must be specified: the path to file and new directory path are required`);
  }
  const fileName = getClearFileName(filePath)
  const sourceFilePath = getClearFilePath(currentPath, filePath);
  const destinationDirPath = getClearFilePath(currentPath, newDirectoryPath);
  const destinationDirWithFilePath = destinationDirPath + '/' + fileName;

  const sourceFileExist = await isFileExistByPath(sourceFilePath);
  const destinationDirExist = await isDirExistByPath(destinationDirPath);
  const destinationFileExist = await isFileExistByPath(destinationDirWithFilePath);

  if (!sourceFileExist) {
    return callback(`File ${sourceFilePath} doesn't exist`);
  }

  if (!destinationDirExist) {
    return callback(`Destination dir doesn't exist in path ${destinationDirPath}`);
  }

  if (destinationFileExist) {
    return callback(`File ${fileName} in dir ${destinationDirPath} already exists`);
  }

  const sourceStream = fs.createReadStream(sourceFilePath);
  const destinationStream = fs.createWriteStream(destinationDirWithFilePath);

  sourceStream.pipe(destinationStream);
  console.log(`File copied successful from ${filePath} to ${destinationDirWithFilePath}`)
  callback(null);
}

async function mv (currentPath, [filePath, newDirectoryPath], callback) {
  if (!filePath || !newDirectoryPath) {
    return callback(`2 arguments must be specified: the path to file and new directory path are required`);
  }

  await cp(currentPath, [filePath, newDirectoryPath], (err) => {
    if (err) return callback(err)
  })

  await rm(currentPath, [filePath], () => {})
  console.log(`File moved successful from ${filePath} to ${newDirectoryPath}`)
  callback(null);
}

async function rm (currentPath, [filePath], callback) {
  if (!filePath) {
    return callback(`The path to file is required parameter`);
  }

  const path = getClearFilePath(currentPath, filePath);

  if (!await isFileExistByPath(path)) {
    return callback(`File doesn't exist in ${path}`);
  }

  fs.rm(path, (err) => {
    if (err) {
      callback(`Failed to delete: ${path}`)
    } else {
      console.log(`File deleted successful in path ${filePath}`);
      callback(null);
    }
  })
}

export { up, cd, ls, cat, add, rn, cp, mv, rm }