// require modules
const fs = require('fs');
const lsWithIgnore = require('./lsWithIgnore');
const zipFiles = require('./zipFiles');

const now = new Date();
const buildId = `${now.toISOString().replace(/\:/g, '_')}`;
console.log(buildId);
const buildPath = path.join(__dirname, `ebDist/${buildId}.zip`);


const gitignores = fs.readFileSync('./.gitignore', 'utf-8').split('\r\n').filter((gitignore) => gitignore.length);
const blackList = [
  ...gitignores,
  'bin',
  'devBin',
  'example',
  'testImage',
  'tmp',
  '.git',
  '.gitmodules',
  '.gitignore',
  'ebDist',
];

const whiteList = [
  'dist',
];

lsWithIgnore(__dirname, blackList, whiteList)
  .then((targetFiles) => {
    return zipFiles(targetFiles, buildPath);
  });

