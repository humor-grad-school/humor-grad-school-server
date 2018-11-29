import util from 'util';
import uuid from 'uuid/v4';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const isWindows = process.platform === 'win32';

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const execAsync = util.promisify(exec);

const tmpDir = path.join(__dirname, '../../../tmp');
const binDir = path.join(__dirname, '../../../bin');
const MAX_WIDTH = 300;

const createTmpDirIfNotExistsPromise = new Promise((resolve, reject) => {
  fs.exists(tmpDir, (exists) => {
    if (exists) {
      return resolve();
    }

    fs.mkdir(tmpDir, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
});

export default async function encodeVideo(buffer) {
  await createTmpDirIfNotExistsPromise;

  const inputFilename = uuid();
  const inputFilePath = path.join(tmpDir, inputFilename);
  const outputFilename = `${uuid()}.mp4`;
  const outputFilePath = path.join(tmpDir, outputFilename);

  await writeFileAsync(inputFilePath, buffer);

  // tslint:disable-next-line
  const command = `ffmpeg${isWindows ? '.exe' : ''} -i ${inputFilePath} -c:v libx264 -vf "scale=w=min(iw\\,${MAX_WIDTH}):h=-2" -crf 24 ${outputFilePath}`;
  const { stdout, stderr } = await execAsync(command, {
    cwd: binDir,
  });

  const outputBuffer = await readFileAsync(outputFilePath);

  return outputBuffer;
}
