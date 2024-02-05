import * as readline from 'node:readline';
import { commandHandlers } from './commands.js';
import * as os from 'os';

const argv = getParsedArgv(process.argv)
const userName = argv['--username'];

if (!userName) {
  throw new Error('Unknown user name.\n' +
    'Script must include name of user on key "--userName"');
}

let currentPath = os.homedir();

console.log(`Welcome to the File Manager, ${userName}!`)
console.log(`You are currently in ${currentPath}`)

const rl = readline.promises.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function fileManager () {
  rl.on('line', (input) => {
    const { command, args } = getCommandAndArguments(input);

    const handler = commandHandlers[command];

    if (handler) {
      handler(currentPath, args, (err, path) => {
        if (err) {
          consoleRed(err);
          consoleRed('Operation failed. Please try again.');
          rl.prompt()
        }

        if (path && path !== currentPath) {
          currentPath = path
        }

        consoleBlue(`You are currently in ${currentPath}`);
      });
    } else if (command === '.exit') {
      rl.close()
    } else {
      consoleRed('Invalid input. Please try again.');
      rl.prompt()
    }
  });

  rl.on('close', () => console.log(`\nThank you for using File Manager, ${userName}, goodbye!`))

}

await fileManager()

/**
 * Parsing process argv
 * @param processArgv
 * @returns {*}
 */
function getParsedArgv (processArgv) {
  return processArgv.slice(2).reduce((acc, item) => {
    const [key, value] = item.split('=');
    return { ...acc, [key]: value };
  }, {});
}

/**
 * Parsing user command
 * @param input
 * @returns {{args: string[], command: string}|{args: null, command}}
 */
function getCommandAndArguments (input) {
  const clearInput = input.trim();
  const firstSpaceIndex = clearInput.indexOf(' ');

  if (firstSpaceIndex === -1) {
    return { command: clearInput, args: [] };
  }

  const command = clearInput.substring(0, firstSpaceIndex);
  const args = clearInput.substring(firstSpaceIndex + 1).split(' ');

  return { command, args };
}

function consoleRed (text) { console.log('\x1b[31m', text, '\x1b[0m') };
function consoleBlue (text) { console.log('\x1b[34m', text, '\x1b[0m') };
