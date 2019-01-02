import { initPromise } from ".";
import serverless from 'serverless-http';

let serverlessKoaApp;
export async function handler(event, context) {
  await initPromise;

  const { app } = await import('./Api');

  if (!serverlessKoaApp) {
    serverlessKoaApp = serverless(app);
  }

  return await serverlessKoaApp(event, context);
}
