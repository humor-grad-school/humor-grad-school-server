process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() == 'production') ? 'production' : 'development';

export const isDevelopment: boolean = process.env.NODE_ENV === 'development';

import { initConfiguration } from './configuration';
import 'module-alias/register';

async function logForInit(name, func: Function) {
  console.log(`${name} Init Start`);
  await func();
  console.log(`${name} Init Finished`);
}

export const initPromise = initConfiguration().then(async () => {
  await Promise.all([
    logForInit('deHelper', async () => {
      await (await import('./dbHelper')).init();
    }),
    logForInit('api router', async () => {
      await (await import('./Api')).init();
    }),
    logForInit('s3Helper', async () => {
      await (await import('./s3Helper')).default.init();
    }),
  ]);
})
.then(() => { console.log('All Init Finished'); })
.catch((err) => {
  console.error(err);
  throw new Error(err);
});
