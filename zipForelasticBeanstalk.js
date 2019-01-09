// require modules
const fs = require('fs').promises;
const fsSync = require('fs');
const archiver = require('archiver');
const path = require('path');
const ignore = require('ignore');

// create a file to stream archive data to.
const now = new Date();
const buildId = `${now.toISOString().replace(/\:/g, '_')}`;
const output = fsSync.createWriteStream(path.join(__dirname, `ebDist/eb-build-${buildId}.zip`));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function() {
  console.log('Data has been drained');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);



const gitignores = fsSync.readFileSync('./.gitignore', 'utf-8').split('\r\n').filter((gitignore) => gitignore.length);
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
  'generated',
];

const whiteList = [
  'dist',
];
const ignoreList = blackList.filter((blackWord) => whiteList.every(whiteWord => blackWord !== whiteWord));

const ig = ignore().add(ignoreList);

function cutDirnameAndMakeItLinuxPath(targetPath) {
  return targetPath.substring(__dirname.length + 1).replace(/\\/g, '/');
}
function testIgnore(targetPath) {
  const nodePathForIgnore = cutDirnameAndMakeItLinuxPath(targetPath);
  if (!nodePathForIgnore.length) {
    return false;
  }
  return ig.ignores(nodePathForIgnore);
}

async function getTargetFiles(currentPath, isDirectory = true) {
  if (!isDirectory) {
    return cutDirnameAndMakeItLinuxPath(currentPath);
  }
  if (testIgnore(currentPath)) {
    return [];
  }
  const dir = await fs.readdir(currentPath, {
    withFileTypes: true,
  });
  const files = await Promise.all(dir.map(node => {
    const nodePath = path.join(currentPath, node.name);
    return getTargetFiles(nodePath, node.isDirectory());
  }));

  return files.reduce((acc, val) => acc.concat(val), []);
}


getTargetFiles(__dirname)
  .then((targetFiles) => {
    targetFiles.forEach((targetFile) => {
      archive.append(targetFile, { name: targetFile });
    });
    archive.finalize();
  });

