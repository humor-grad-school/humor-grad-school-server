import Router from 'koa-router';
import PostModel from '@/Model/PostModel';
import validateBody from './validateBody';

import encode from './encode/encode';
import BoardModel from '@/Model/BoardModel';
import { passAuthorizationMiddleware } from './AuthorizationPassService';
import { transaction } from 'objection';
import { getConfiguration } from '@/configuration';

const router = new Router();

class PostPostBody {
  title: string;
  contentS3Key: string;
  boardName: string;
}

router.post('/', validateBody(PostPostBody), async ctx => {
  const body = ctx.request.body as PostPostBody;
  const writerId = ctx.session.userId;

  const board = await BoardModel.query().findOne({ name: body.boardName });
  const post = await PostModel.query().insert({
    title: body.title,
    contentS3Key: body.contentS3Key,
    writerId,
    boardId: board.id,
    thumbnailUrl: PostModel.defaultThumbnailUrl,
  });
  ctx.body = post;
});

router.get('/:id', passAuthorizationMiddleware, async ctx => {
  const { id } = ctx.params;
  const post = await PostModel.query().findById(id).eager('comments');
  if (!post) {
    return ctx.status = 404;
  }
  ctx.body = post;
});

router.post('/encode/:key', async ctx => {
  const { key } = ctx.params;
  await encode(key, getConfiguration().AFTER_ENCODING_S3_BUCKET, key);
  // TODO : return url of media
  ctx.status = 200;
});

router.post('/:postId/like', async ctx => {
  const { postId } = ctx.params;

  const post = await PostModel.query().findById(postId);

  if (!post) {
    return ctx.status = 404;
  }

  const { userId } = ctx.session;
  await transaction(PostModel.knex(), async (trx) => {
    // If user already liked, then this query will day 'duplicated primary key'.
    await post.$relatedQuery('likers', trx).relate(userId);

    await post.$query(trx).increment('likes', 1);
  });

  ctx.status = 200;
});

export default router;
