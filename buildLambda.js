const fs = require('fs-extra');
const lsWithIgnore = require('./lsWithIgnore');
const path = require('path');

const exec = require('child_process').exec;

const distPath = path.join(__dirname, 'lambdaDist');
if (!fs.existsSync(distPath)){
  fs.mkdirSync(distPath);
}

function copyFiles(filePaths, dest) {
  return Promise.all(filePaths.map(async (filePath) => {
    await fs.copy(filePath, `${dest}/${filePath}`);
  }));
}

function execAsync(cmd, skipError = true) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        if (skipError) {
          console.warn(stderr);
        } else {
          throw stderr;
        }
      }
      resolve(stdout);
    });
  });
}

async function getSourceFiles() {
  const gitignores = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf-8').split('\r\n').filter((gitignore) => gitignore.length);
  const blackList = [
    ...gitignores,
    'bin/*',
    'devBin',
    'example',
    'testImage',
    'tmp',
    '**/.git',
    '.gitmodules',
    '.gitignore',
    'ebDist',
    'lambdaDist',
  ];
  const whiteList = [
    'bin/ffmpeg',
  ];
  const files = await lsWithIgnore(__dirname, blackList, whiteList, false);
  return files;
}

async function run() {
  const destPath = path.resolve(process.argv[2]);
  const files = await getSourceFiles();

  console.log('fs.emptyDir(distPath);');
  await fs.emptyDir(distPath);

  console.log('copyFiles');
  await copyFiles(files, distPath);

  process.chdir(distPath);

  console.log('npm install');
  await execAsync(`npm install`);

  console.log('npm run build');
  await execAsync(`npm run build`);

  console.log(`fs.remove(path.join(distPath, 'node_modules'))`);
  await fs.remove(path.join(distPath, 'node_modules'));

  // RUN npm install --production
  console.log(`npm install --production`);
  await execAsync(`npm install --production`);

  // RUN du -sh node_modules

  console.log(`get total size of node_modules`);
  const nodeModulePath = path.join(distPath, 'node_modules');
  const nodeModuleFiles = await lsWithIgnore(nodeModulePath, [], [], false);
  const sizes = await Promise.all(nodeModuleFiles.map(async (file) => {
    const fileAbsolutePath = path.join(nodeModulePath, file);
    const stat = await fs.stat(fileAbsolutePath);
    return stat.size;
  }));
  const totalSize = sizes.reduce((acc, value) => acc + value);
  console.log(`${totalSize / 1000000} MB`);


  // RUN npx sls package --package /tmp/package
  console.log(`npx sls package --package ${destPath}`);
  await execAsync(`npx sls package --package ${destPath}`);
}

run().then(() => {
  console.log('finished');
}).catch(err => {
  console.log('error!');
  console.error(err);
});