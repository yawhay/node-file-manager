import * as osModule from 'os';

function os (_, [flag], callback) {
  const flags = ['--EOL', '--cpus', '--homedir', '--username', '--architecture']
  if (!flags.includes(flag)) {
    return callback(`Command os must includes one of next flags: ${flags.join(', ')}`);
  }
  switch (flag) {
    case '--EOL':
      console.log('End-Of-Line (EOL): ', JSON.stringify(osModule.EOL));
      break;
    case '--homedir':
      console.log('Home Directory:', osModule.homedir());
      break;
    case '--username':
      console.log('System Username:', osModule.userInfo().username);
      break;
    case '--architecture':
      console.log('CPU Architecture:', osModule.arch());
      break
    case '--cpus':
      const cpus = osModule.cpus();

      console.log('CPUs Info:');
      console.log(`Total CPUs: ${cpus.length}`);

      cpus.forEach((cpu, index) => {
        console.log(`CPU ${index + 1}:`);
        console.log(`  Model: ${cpu.model}`);
        console.log(`  Speed: ${cpu.speed} MHz`);
      });
      break
  }
  callback(null);
}

export { os }