import Router from 'koa-router';
import { IsInt } from 'class-validator';
import config from '@/config.json';
import PostModel from '@/Model/PostModel';
import validateBody from './validateBody';
import s3Helper from '@/s3Helper';

import encode from './encode/encode';
import CommentModel from '@/Model/CommentModel';
import BoardModel from '@/Model/BoardModel';
import { passAuthorizationMiddleware } from './AuthorizationPassService';

const router = new Router();

class PostPostBody {
  @IsInt({})
  writerId: number;
  title: string;
  contentS3Key: string;
  boardName: string;
}

router.post('/', validateBody(PostPostBody), async ctx => {
  const body = ctx.request.body as PostPostBody;

  const board = await BoardModel.query().findOne({ name: body.boardName });
  const post = await PostModel.query().insert({
    title: body.title,
    contentS3Key: body.contentS3Key,
    writerId: body.writerId,
    boardId: board.id,
  });
  ctx.body = post;
});

class CommentPostBody {
  writerId: number;
  contentS3Key: string;
}

router.post('/:postId/comment', validateBody(CommentPostBody), async ctx => {
  const { postId } = ctx.params;

  await CommentModel.query().insert({
    writerId: ctx.request.body.writerId,
    contentS3Key: ctx.request.body.contentS3Key,
    postId,
  });

  ctx.status = 200;
});

router.get('/comment/:commentId', passAuthorizationMiddleware, validateBody(CommentPostBody), async ctx => {
  const { commentId } = ctx.params;

  const comment = await CommentModel.query().findById(commentId);
  if (!comment) {
    return ctx.status = 404;
  }

  ctx.body = comment;
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

export default router;
