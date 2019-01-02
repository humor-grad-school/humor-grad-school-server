import { initPromise } from ".";

const PORT = 8080;

async function run () {
  await initPromise;

  const { app } = await import('./Api');

  app.listen(PORT, () => {
    console.log(`server listen ${PORT}`)
  });
}

run();
