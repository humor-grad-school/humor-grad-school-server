process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() == 'production') ? 'production' : 'development';

export const isDevelopment: boolean = process.env.NODE_ENV === 'development';

import { initConfiguration } from './configuration';
import 'module-alias/register';

export const initPromise = initConfiguration().then(async () => {
  const { init } = await import('./dbHelper');
  const initApi = (await import('./Api')).init;
  const s3Helper = (await import('./s3Helper')).default;

  await Promise.all([
    init(),
    initApi(),
    s3Helper.init(),
  ]);
})
.then(() => { console.log('Init Finished'); })
.catch((err) => {
  console.error(err);
  throw new Error(err);
});
