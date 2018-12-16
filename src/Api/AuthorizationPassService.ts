import Router from 'koa-router';
import sessionCacheService from './Cache/sessionCacheService';

export default class AuthorizationPassService {
  private passingAuthorizationPathRegExpList: RegExp[] = [];
  constructor(private router: Router) {
  }
  getAuthorizationMiddleware() {
    return async (ctx, next) => {
      const isPassablePath = this.passingAuthorizationPathRegExpList.some(regexp => regexp.test(ctx.path));
      if (isPassablePath) {
        return next();
      }

      console.log(`you need seesion to call this api : ${ctx.path}`);
      const sessionToken = ctx.request.method === 'GET'
        ? ctx.params.sessionToken
        : ctx.body.sessionToken;

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
