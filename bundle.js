import { execSync } from 'child_process';
import * as fs from 'fs';

console.log("yayAV Bundler - Model Sidecar");
console.log("Saving current directory and moving to sidecar...");
const owd = process.cwd();
process.chdir('./sidecar-model');

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

process.chdir(owd);
console.log("Moved back to root.");
