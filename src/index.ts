process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() == 'production') ? 'production' : 'development';

export const isDevelopment: boolean = process.env.NODE_ENV === 'development';

import { initConfiguration } from './configuration';
import 'module-alias/register';

initConfiguration().then(async () => {
  const { init } = await import('./dbHelper');
  const run = (await import('./Api')).default;
  const s3Helper = (await import('./s3Helper')).default;

  await init();
  await run(8080);
  await s3Helper.init();
})
.then(() => { console.log('Init Finished'); })
.catch((err) => { console.error(err); })




