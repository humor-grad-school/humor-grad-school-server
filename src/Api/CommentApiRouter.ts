import Router from 'koa-router';
import validateBody from './validateBody';

import CommentModel from '@/Model/CommentModel';
import { passAuthorizationMiddleware } from './types/generated/server/ServerBaseApiRouter';
import { transaction } from 'objection';

const router = new Router();

class CommentPostBody {
  contentS3Key: string;
  postId: number;
}

router.post('/', validateBody(CommentPostBody), async ctx => {
  const { userId } = ctx.session;
  const {
    postId,
    contentS3Key,
  } = ctx.request.body as CommentPostBody;

  const comment = await CommentModel.query().insert({
    writerId: userId,
    contentS3Key,
    postId,
  });

  ctx.status = 200;
  ctx.body = comment;
});

router.get('/:commentId', passAuthorizationMiddleware, validateBody(CommentPostBody), async ctx => {
  const { commentId } = ctx.params;

  const comment = await CommentModel.query().findById(commentId);
  if (!comment) {
    return ctx.status = 404;
  }

  ctx.body = comment;
});

router.post('/:commentId/like', async ctx => {
  const { commentId } = ctx.params;
  const { userId } = ctx.session;

  const comment = await CommentModel.query().findById(commentId);

  if (!comment) {
    return ctx.status = 404;
  }

  await transaction(CommentModel.knex(), async (trx) => {
    // If user already liked, then this query will day 'duplicated primary key'.
    await comment.$relatedQuery('likers', trx).relate(userId);

    await comment.$query(trx).increment('likes', 1);
  });

  ctx.status = 200;
});

router.post('/:parentCommentId', validateBody(CommentPostBody), async ctx => {
  const { parentCommentId } = ctx.params;
  const {
    writerId,
    contentS3Key,
    postId,
  } = ctx.request.body;

  await CommentModel.query().insert({
    writerId,
    contentS3Key,
    postId,
    parentCommentId,
  });

  ctx.status = 200;
});


export default router;
