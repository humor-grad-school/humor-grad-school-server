import express from 'express';
import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import { ErrorCode } from './ErrorCode';
import config from '@/config.json';
import PostModel from '@/Model/PostModel';
import validateBody from './validateBody';
import UserModel from '@/Model/UserModel';
import s3Helper from '@/s3Helper';

import encodeVideo from '@/Api/encode/encodeVideo';
import '@/Api/encode/encodeVideo';
import encode from './encode/encode';

const router = express.Router();

class PostPostBody {
  @IsInt({})
  writerId: number;
  title: string;
  contentS3Key: string;
}

router.post('/', validateBody(PostPostBody), async (req, res) => {
  const body = req.body as PostPostBody;

  const user = await UserModel.query().where({ id: body.writerId }).first();
  await user.$relatedQuery<PostModel>('posts').insert({
    title: body.title,
    contentS3Key: body.contentS3Key,
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
  const post = await PostModel.query().where('id', id).first();
  if (!post) {
    res.sendStatus(404);
    return;
  }
  console.log(post);
  res.send(post);
});

router.post('/encode/:key', async (req, res) => {
  const { key } = req.params;
  await encode(key);
  res.sendStatus(200);
});

export default router;
