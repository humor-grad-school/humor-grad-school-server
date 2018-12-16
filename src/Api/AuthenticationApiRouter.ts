import Router from 'koa-router';
import UserModel from '@/Model/UserModel';
import uuid from 'uuid/v4';
import sessionCacheService from './Cache/sessionCacheService';
import { ErrorCode } from './ErrorCode';
import { getAuthenticationService } from './AuthenticationService';
import { AuthenticationRequestData } from './AuthenticationService/BaseAuthenticationService';
import { passAuthorizationMiddleware } from './AuthorizationPassService';

const router = new Router();

async function issueSessionToken(user: UserModel): Promise<string> {
  const sessionToken = uuid();
  await sessionCacheService.set(sessionToken, user.id);
  return sessionToken;
}

router.post('/:origin', passAuthorizationMiddleware, async (ctx, next) => {
  const { origin }: { origin : string } = ctx.params;
  const {
    authenticationRequestData,
  }:{
    authenticationRequestData: AuthenticationRequestData,
  } = ctx.request.body;

  const authenticationService = getAuthenticationService(origin);

  if (!authenticationService) {
    console.warn('wrong identityType - ', origin);
    ctx.status = 400;
    ctx.body = {
      errorCode: ErrorCode.AuthenticateErrorCode.WrongIdentityType,
    };
    return;
  }

  const authResult = await authenticationService.authenticateRequest(authenticationRequestData);

  if (!authResult) {
    console.warn('authentication failed'); // TODO : Add more Information
    ctx.status = 401;
    ctx.body = {
      errorCode: ErrorCode.AuthenticateErrorCode.AuthenticationFailed,
    };
    return;
  }

  const identity = await authenticationService.getIdentity(authResult.identityId)
    || await authenticationService.createIdentity(authResult);

  const user = await identity.getUser();
  if (!user) {
    // TODO : Need sign in
    console.warn('No user with Identity. Need sign in');
    ctx.status = 401;
    ctx.body = {
      errorCode: ErrorCode.AuthenticateErrorCode.NoUser,
    };
    return;
  }

  const sessionToken = await issueSessionToken(user);

  ctx.body = {
    sessionToken,
  };
});

export default router;
