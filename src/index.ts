process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';

import 'module-alias/register';
import { init } from './dbHelper';
import run from './Api';
import s3Helper from './s3Helper';

async function main() {
  await init();
  await run(8080);
  await s3Helper.init();

  console.log(await s3Helper.createPresignedPost(10));
}

main()
  .then(() => { console.log('Init Finished'); })
  .catch((err) => { console.error(err); })