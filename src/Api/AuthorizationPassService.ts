import Router, { IRouterContext } from 'koa-router';
import sessionCacheService from './Cache/sessionCacheService';
import { passAuthorizationMiddleware } from './types/generated/server/ServerBaseApiRouter';
import { ErrorCode } from './types/generated/ErrorCode';

export default class AuthorizationPassService {
  private passingAuthorizationPathRegExpList: RegExp[] = [];
  constructor(private router: Router) {
  }
  getAuthorizationMiddleware() {
    return async (ctx: IRouterContext, next) => {
      const isPassablePath = this.passingAuthorizationPathRegExpList.some(regexp => regexp.test(ctx.path));

      const authorizationHeader: string = ctx.request.headers.authorization
        ? ctx.request.headers.authorization.toLowerCase()
        : undefined;

      if (!authorizationHeader) {
        if (isPassablePath) {
          return next();
        }
        ctx.response.body = {
          isSuccessful: false,
          errorCode: ErrorCode.DefaultErrorCode.Unauthenticated,
        };
        return;
      }

      if (authorizationHeader.indexOf('sessiontoken ') !== 0) {
        ctx.response.body = {
          isSuccessful: false,
          errorCode: ErrorCode.DefaultErrorCode.Unauthenticated,
        };
        return;
      }

      const sessionToken = authorizationHeader.substring('sessiontoken '.length);
      if (!sessionToken) {
        ctx.response.body = {
          isSuccessful: false,
          errorCode: ErrorCode.DefaultErrorCode.Unauthenticated,
        };
        return;
      }

      const session = await sessionCacheService.get(sessionToken);
      if (!session) {
        ctx.response.body = {
          isSuccessful: false,
          errorCode: ErrorCode.DefaultErrorCode.Unauthenticated,
        };
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
