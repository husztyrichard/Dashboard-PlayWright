const { spawn } = require('child_process');

const procs = [];

function start(cmd, name) {
  console.log(`Starting: ${cmd}`);
  const p = spawn(cmd, { shell: true, stdio: 'inherit' });
  procs.push(p);
  p.on('exit', (code) => {
    console.log(`${name} exited with ${code}`);
    // don't exit the parent process; just log and keep the server process alive
  });
}

start('node backend/server.js', 'backend');
// start frontend after short delay to give backend time to initialize
setTimeout(() => start('npx live-server . --port=5500 --quiet', 'frontend'), 2000);

process.on('SIGINT', () => {
  procs.forEach(p => p.kill());
  process.exit(0);
});

process.on('SIGTERM', () => {
  procs.forEach(p => p.kill());
  process.exit(0);
});

// keep process alive
setInterval(() => {}, 1 << 30);
