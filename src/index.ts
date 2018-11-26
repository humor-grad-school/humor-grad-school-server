import 'module-alias/register';
import { init } from './dbHelper';
import run from './Api';

async function main() {
  await init();
  await run(8080);
}

main()
  .then(() => { console.log('Init Finished'); })
  .catch((err) => { console.error(err); })