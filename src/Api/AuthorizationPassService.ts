import Router, { IRouterContext } from 'koa-router';
import sessionCacheService from './Cache/sessionCacheService';

export default class AuthorizationPassService {
  private passingAuthorizationPathRegExpList: RegExp[] = [];
  constructor(private router: Router) {
  }
  getAuthorizationMiddleware() {
    return async (ctx: IRouterContext, next) => {
      const isPassablePath = this.passingAuthorizationPathRegExpList.some(regexp => regexp.test(ctx.path));

      const authorizationHeader: string = (
        ctx.request.headers.authorization
        || ctx.request.headers.Authorization
      ).toLowerCase();

      if (!authorizationHeader) {
        if (isPassablePath) {
          return next();
        }
        ctx.status = 401;
        return;
      }

      if (authorizationHeader.indexOf('sessiontoken ') !== 0) {
        ctx.status = 401;
        return;
      }

      const sessionToken = authorizationHeader.substring('sessiontoken '.length);

      if (!sessionToken) {
        ctx.status = 401;
        return;
      }

      const session = await sessionCacheService.get(sessionToken);
      if (!session) {
        ctx.status = 401;
        return;
      }

      ctx.session = session;

      return next();
    }
  }
  updatePasssingAuthorizationPathRegExpList() {
    this.router.stack.forEach(layer => {
      if (layer.stack.includes(passAuthorizationMiddleware)) {
        this.passingAuthorizationPathRegExpList.push(layer.regexp);
      }
    });
  }
}

export async function passAuthorizationMiddleware(ctx, next) {
  return await next();
}
