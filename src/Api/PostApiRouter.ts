import express from 'express';
import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import { ErrorCode } from './ErrorCode';
import config from '@/config.json';
import PostModel from '@/Model/PostModel';
import validateBody from './validateBody';
import UserModel from '@/Model/UserModel';
import s3Helper from '@/s3Helper';

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

router.get('/preSignedUrl', async (req, res) => {
  const { fields, url, key } = await s3Helper.createPresignedPost(20);
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

export default router;
