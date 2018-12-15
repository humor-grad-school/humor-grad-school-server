import Router from 'koa-router';
import UserModel from '@/Model/UserModel';
import { getAuthenticationService } from './AuthenticationService';
import { transaction } from 'objection';
import { AuthenticationRequestData } from './AuthenticationService/IAuthenticationService';
import { passAuthorizationMiddleware } from './AuthorizationPassService';

const router = new Router();

class UserPostBody {
  username: string;
  origin: string;
  authenticationRequestData: AuthenticationRequestData;
}

router.post('/', passAuthorizationMiddleware, async ctx => {
  const {
    username,
    origin,
    authenticationRequestData,
  } = ctx.request.body as UserPostBody;

  const authenticationService = getAuthenticationService(origin);

  if (!authenticationService) {
    // wrong origin
    ctx.status = 404;
    return;
  }

  const authResult = await authenticationService.authenticateRequest(authenticationRequestData);

  if (!authResult) {
    // TODO
    ctx.status = 401;
    return;
  }

  const identity = await authenticationService.getIdentity(authResult.identityId);
  if (!identity) {
    // identity should be there!
    ctx.status = 404;
    return;
  }

  try {
    await transaction(UserModel.knex(), async (trx) => {
      const user = await UserModel.query(trx).insert({
        username,
      });
      await identity.$relatedQuery<UserModel>('user', trx).relate(user);
    });
  } catch(err) {
    // failed to create user or relate identity to that
    ctx.status = 500;
    return;
  }

  ctx.status = 200;
});

router.get('/:id', passAuthorizationMiddleware, async ctx => {
  const id = ctx.params.id;
  const user = await UserModel.query().findById(id);
  if (!user) {
    ctx.status = 404;
    return;
  }
  ctx.body = user;
});

export default router;
