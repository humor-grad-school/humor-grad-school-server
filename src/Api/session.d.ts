import { ISession } from "./Cache/sessionCacheService";

declare module 'koa-router' {
    interface IRouterContext {
      session: ISession;
   }
}
