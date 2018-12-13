import Router from 'koa-router';
import IAuthenticationService from './AuthenticationService/IAuthenticationService';
import GoogleAuthenticationService from './AuthenticationService/GoogleAuthenticationService';
import { Context } from 'koa';
import UserModel from '@/Model/UserModel';
import uuid from 'uuid/v4';
import sessionCacheService from './Cache/sessionCacheService';

const router = new Router();

const authenticationServices: { [key: string]: IAuthenticationService } = {
  google: new GoogleAuthenticationService(),
};

async function issueSessionToken(user: UserModel): Promise<string> {
  const sessionToken = uuid();
  await sessionCacheService.set(sessionToken, user.id);
  return sessionToken;
}

router.post('/:identityType', async ctx => {
  const { identityType } = ctx.params;
  const authenticationService = authenticationServices[identityType];

  if (!authenticationService) {
    console.warn('wrong identityType - ', identityType);
    ctx.status = 400;
    return;
  }

  const authResult = await authenticationService.authenticateRequest(ctx.request);

  if (!authResult) {
    console.warn('authentication failed'); // TODO : Add more Information
    ctx.status = 401;
    return;
  }

  let identity = await authenticationService.getIdentity(authResult);

  if (!identity) {
    // TODO : Need sign in
    console.warn('No identity. Need sign in');
    ctx.status = 401;
    return;
  }

  const user = await identity.getUser();
  if (!user) {
    // TODO : Need sign in
    console.warn('No user with Identity. Need sign in');
    ctx.status = 401;
    return;
  }

  const sessionToken = await issueSessionToken(user);

  ctx.body = {
    sessionToken,
  };
});

export default router;
