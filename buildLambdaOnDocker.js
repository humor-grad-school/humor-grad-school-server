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
        console.log(`${cmd} error`)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        return reject(error);
      }
      if (stderr) {
        if (skipError) {
          console.warn(stderr);
        } else {
          throw stderr;
        }
      }
      console.log(`${cmd} finished\n${stdout}`);
      resolve(stdout);
    });
  });
}

async function getSourceFolderAndFiles() {
  const gitignores = fs.readFileSync('./.gitignore', 'utf-8').split('\r\n').filter((gitignore) => gitignore.length);
  const blackList = [
    ...gitignores,
    'bin/*',
    'devBin',
    'example',
    'testImage',
    'tmp',
    '**/.git',
    '.gitmodules',
    'ebDist',
    'lambdaDist',
  ];
  const whiteList = [
    'bin/ffmpeg',
  ];
  const files = await lsWithIgnore(__dirname, blackList, whiteList, true);
  return files;
}

async function run() {
  // node .\buildLambda.js C:\Users\user\Documents\programming\humor-grad-school-server\lambdaDist\result
  // npx sls deploy --package C:\Users\user\Documents\programming\humor-grad-school-server\lambdaDist\result --aws-profile hgs

  // docker build -t lambda-builder-image -f Dockerfile.lambdabuild .
  // docker run --name lambda-builder -d lambda-builder-image tail -f /dev/null

  const folderAndFiles = await getSourceFolderAndFiles();

  const folders = folderAndFiles.filter((item) => item.lastIndexOf('/') === item.length - 1);
  const files = folderAndFiles.filter((item) => item.lastIndexOf('/') !== item.length - 1);
  const topSubFolders = folders.filter(folder => folder.indexOf('/') === folder.length - 1);

  await execAsync(`docker exec lambda-builder find /tmp/src/ -type f -delete`);
  for await (folder of topSubFolders) {
    await execAsync(`docker exec lambda-builder rm -rf /tmp/src/${folder}`);
  }

  for await (folder of folders) {
    await execAsync(`docker exec lambda-builder mkdir /tmp/src/${folder}`);
  }

  await Promise.all(files.map(async (file) => {
    await execAsync(`docker cp ${file} lambda-builder:/tmp/src/${file}`);
  }));
  await execAsync(`docker exec lambda-builder npm install`);
  await execAsync(`docker exec lambda-builder node buildLambda.js /tmp/package`);
  await execAsync(`docker cp lambda-builder:/tmp/package ./lambdaDist`);
}

run().then(() => {
  console.log('finished');
}).catch(err => {
  console.log('error!');
  console.error(err);
});

