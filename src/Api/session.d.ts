import { Session } from "./types/generated/server/ServerBaseApiRouter";

declare module 'koa-router' {
    interface IRouterContext {
      session: Session;
   }
}
