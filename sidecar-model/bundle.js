const { execSync } = require('child_process');
const fs = require('fs');
console.log(__dirname);
console.log("Packinging sidecar...");
const pkg = execSync('pkg . --output yaymodel');

const ext = process.platform === 'win32' ? '.exe' : '';
console.log("Getting host info...");
const rustInfo = execSync('rustc -vV');
const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
if (!targetTriple) {
  console.error('Failed to determine platform target triple');
}
console.log('Moving binary...');
fs.renameSync(
  `./yaymodel${ext}`,
  `../src-tauri/binaries/yaymodel-${targetTriple}${ext}`
);