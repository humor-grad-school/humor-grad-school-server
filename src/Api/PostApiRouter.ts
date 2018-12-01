import express from 'express';
import { IsInt } from 'class-validator';
import config from '@/config.json';
import PostModel from '@/Model/PostModel';
import validateBody from './validateBody';
import s3Helper from '@/s3Helper';

import encode from './encode/encode';
import CommentModel from '@/Model/CommentModel';
import BoardModel from '@/Model/BoardModel';

const router = express.Router();

class PostPostBody {
  @IsInt({})
  writerId: number;
  title: string;
  contentS3Key: string;
  boardName: string;
}

router.post('/', validateBody(PostPostBody), async (req, res) => {
  const body = req.body as PostPostBody;

  const board = await BoardModel.query().findOne({ name: body.boardName });
  const post = await PostModel.query().insert({
    title: body.title,
    contentS3Key: body.contentS3Key,
    writerId: body.writerId,
    boardId: board.id,
  });
  res.send(post);
});

class CommentPostBody {
  writerId: number;
  contentS3Key: string;
}

router.post('/:postId/comment', validateBody(CommentPostBody), async (req, res) => {
  const { postId } = req.params;

  await CommentModel.query().insert({
    writerId: req.body.writerId,
    contentS3Key: req.body.contentS3Key,
    postId,
  });

  res.sendStatus(200);
});

router.get('/comment/:commentId', validateBody(CommentPostBody), async (req, res) => {
  const { commentId } = req.params;

  const comment = await CommentModel.query().findById(commentId);
  if (!comment) {
    return res.sendStatus(404);
  }

  res.send(comment);
});

router.post('/:postId/comment/:parentCommentId', validateBody(CommentPostBody), async (req, res) => {
  const { postId, parentCommentId } = req.params;
  await CommentModel.query().insert({
    writerId: req.body.writerId,
    contentS3Key: req.body.contentS3Key,
    postId,
    parentCommentId,
  });

  res.sendStatus(200);
});

const bucketTypeMap = {
  content: config.CONTENT_S3_BUCKET,
  media: config.BEFORE_ENCODING_S3_BUCKET,
}

router.get('/preSignedUrl', async (req, res) => {
  const { type } = req.query;

  const bucket = bucketTypeMap[type];

  if (!bucket) {
    return res.sendStatus(404);
  }

  const { fields, url, key } = await s3Helper.createPresignedPost(20, bucket);
  res.send({
    fields,
    url,
    key,
  });
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const post = await PostModel.query().findById(id).eager('comments');
  if (!post) {
    return res.sendStatus(404);
  }
  res.send(post);
});

router.post('/encode/:key', async (req, res) => {
  const { key } = req.params;
  await encode(key);
  res.sendStatus(200);
});

export default router;
