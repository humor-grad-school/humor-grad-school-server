import Router from 'koa-router';
import config from '@/config.json';
import PostModel from '@/Model/PostModel';
import validateBody from './validateBody';
import s3Helper from '@/s3Helper';

import encode from './encode/encode';
import CommentModel from '@/Model/CommentModel';
import BoardModel from '@/Model/BoardModel';
import { passAuthorizationMiddleware } from './AuthorizationPassService';
import { transaction } from 'objection';

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
  });
  ctx.body = post;
});

class CommentPostBody {
  contentS3Key: string;
}

router.post('/:postId/comment', validateBody(CommentPostBody), async ctx => {
  const { postId } = ctx.params;
  const { userId } = ctx.session;

  const comment = await CommentModel.query().insert({
    writerId: userId,
    contentS3Key: ctx.request.body.contentS3Key,
    postId,
  });

  ctx.status = 200;
  ctx.body = comment;
});

router.get('/comment/:commentId', passAuthorizationMiddleware, validateBody(CommentPostBody), async ctx => {
  const { commentId } = ctx.params;

  const comment = await CommentModel.query().findById(commentId);
  if (!comment) {
    return ctx.status = 404;
  }

  ctx.body = comment;
});

router.post('/comment/:commentId/like', async ctx => {
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

router.post('/:postId/comment/:parentCommentId', validateBody(CommentPostBody), async ctx => {
  const { postId, parentCommentId } = ctx.params;
  await CommentModel.query().insert({
    writerId: ctx.request.body.writerId,
    contentS3Key: ctx.request.body.contentS3Key,
    postId,
    parentCommentId,
  });

  ctx.status = 200;
});

const bucketTypeMap = {
  content: config.CONTENT_S3_BUCKET,
  media: config.BEFORE_ENCODING_S3_BUCKET,
}

router.get('/preSignedUrl', async ctx => {
  const { type } = ctx.query;

  const bucket = bucketTypeMap[type];

  if (!bucket) {
    return ctx.status = 404;
  }

  const { fields, url, key } = await s3Helper.createPresignedPost(20, bucket);
  ctx.body = {
    fields,
    url,
    key,
  };
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
  await encode(key);
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
