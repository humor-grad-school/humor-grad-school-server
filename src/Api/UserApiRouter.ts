import Router from 'koa-router';
import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import UserModel from '@/Model/UserModel';
import { ErrorCode } from './ErrorCode';
import validateBody from './validateBody';

const router = new Router();

async function newUser(username): Promise<UserModel> {
  try {
    return await UserModel.query().insert({
      username,
    });
  } catch (err) {
    // TODO
    throw err;
  }
}

class UserPostBody {
  @Length(2, 8, {
    message: ErrorCode.WrongUserName,
  })
  username: string;
}
// validateBody(UserPostBody),

router.post('/', async ctx => {
  const body = ctx.request.body as UserPostBody;
  const user = await newUser(body.username);
  ctx.body = {
    id: user.id,
  };
});

router.get('/:id', async ctx => {
  const id = ctx.params.id;
  const user = await UserModel.query().findById(id);
  if (!user) {
    ctx.status = 404;
    return;
  }
  ctx.body = user;
});

export default router;
