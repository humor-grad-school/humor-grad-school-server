import express from 'express';
import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import UserModel from '@/Model/UserModel';
import { ErrorCode } from './ErrorCode';

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

function validateBody<T>(type: { new(): T; }) {
  return async (req, res, next) => {
    const body = Object.assign(new type, req.body);
    const validationErrors = await validate(body);
    if (validationErrors.length) {
      next(validationErrors[0]);
      return;
    }
    return next();
  }
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
  const user = await UserModel.query().where('id', id);
  console.log(user);
  res.send(user);
});

export default router;
