import Router from 'koa-router';
import UserModel from '@/Model/UserModel';
import { getAuthenticationService } from './AuthenticationService';
import { transaction } from 'objection';
import { AuthenticationRequestData } from './AuthenticationService/BaseAuthenticationService';
import s3Helper from '@/s3Helper';
import { getConfiguration } from '@/configuration';
import encode from './encode/encode';
import { passAuthorizationMiddleware } from './types/generated/server/ServerBaseApiRouter';

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
        avatarUrl: UserModel.defaultAvatarUrl,
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

// client -> get presignedPost to Server
// client -> post with presigned url to S3
// client -> request change avatar to encoded avatar to Server

router.get('/avatar/presignedPost', async ctx => {
  ctx.body = await s3Helper.createPresignedPost(UserModel.avatarSizeLimit, getConfiguration().BEFORE_ENCODING_S3_BUCKET);
});

router.put('/avatar', async ctx => {
  const { key } = ctx.request.body;

  const { userId } = ctx.session;

  const newAvatarS3Key = await encode(key, getConfiguration().THUMBNAIL_S3_BUCKET, `${userId}-${key}`);

  await UserModel.query().update({
    avatarUrl: `${getConfiguration().avatarBaseUrl}/${newAvatarS3Key}`,
  }).where('id', userId);

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
