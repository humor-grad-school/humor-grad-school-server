import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';

import bodyParser from 'koa-bodyparser';
import UserApiRouter from './UserApiRouter';
import PostApiRouter from './PostApiRouter';
import BoardApiRouter from './BoardApiRouter';
import CommentApiRouter from './CommentApiRouter';
import AuthenticationApiRouter from './AuthenticationApiRouter';
import { isDevelopment } from '..';
import { passAuthorizationMiddleware } from './AuthorizationPassService';
import AuthorizationPassService from './AuthorizationPassService';

export default function run(port: number) {
  const app = new Koa();
  app.use(logger());
  app.use(bodyParser());


  const mainRouter = new Router();
  const authorizationPassService = new AuthorizationPassService(mainRouter);

  if (isDevelopment) {
    const cors = require('@koa/cors');
    app.use(cors());
  }

  mainRouter.use(authorizationPassService.getAuthorizationMiddleware());

  mainRouter.get('/health', passAuthorizationMiddleware, ctx => {
    console.log('health');
    ctx.body = 'hi';
  });

  mainRouter.use('/user', UserApiRouter.routes());
  mainRouter.use('/post', PostApiRouter.routes());
  mainRouter.use('/board', BoardApiRouter.routes());
  mainRouter.use('/auth', AuthenticationApiRouter.routes());
  mainRouter.use('/comment', CommentApiRouter.routes());

  // Should update this in the end of router definition.
  authorizationPassService.updatePasssingAuthorizationPathRegExpList();

  app.use(mainRouter.routes());

  app.on('error', (err, ctx) => {
    console.error(err);

    // if (err instanceof ValidationError) {
    //   const validationError = err;
    //   return res.status(400).send({
    //     errorCode: Object.values(validationError.constraints)[0],
    //   });
    // }

    ctx.status = err.status || 500;
    ctx.body = err.message;
  });

  app.listen(port, () => {
    console.log(`server listen ${port}`)
  });
}
