import express from 'express';
import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import UserModel from '@/Model/UserModel';
import { ErrorCode } from './ErrorCode';
import validateBody from './validateBody';

const router = express.Router();

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

router.post('/', validateBody(UserPostBody), async (req, res) => {
  const body = req.body as UserPostBody;
  try {
    await newUser(body.username);
  } catch (err) {
    return res.sendStatus(500);
  }
  res.sendStatus(200);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const user = await UserModel.query().findById(id);
  if (!user) {
    res.sendStatus(404);
    return;
  }
  res.send(user);
});

export default router;
