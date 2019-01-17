import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import graphqlHTTP from 'koa-graphql';
import bodyParser from 'koa-bodyparser';
import UserApiRouter from './UserApiRouter';
import PostApiRouter from './PostApiRouter';
import AuthenticationApiRouter from './AuthenticationApiRouter';
import { isDevelopment } from '..';
import AuthorizationPassService from './AuthorizationPassService';
import { schema } from './graphql/graphql';
import ViewCountRouter from './ViewCountRouter';
import { passAuthorizationMiddleware } from './types/generated/server/ServerBaseApiRouter';
import BoardApiRouter from './BoardApiRouter';
import MediaApiRouter from './MediaApiRouter';
import CommentApiRouter from './CommentApiRouter';

export const app = new Koa();

export function init() {
  app.proxy = !isDevelopment;
  app.use(logger());
  app.use(bodyParser());


  const mainRouter = new Router();
  const authorizationPassService = new AuthorizationPassService(mainRouter);

  mainRouter.use(authorizationPassService.getAuthorizationMiddleware());

  if (isDevelopment) {
    const cors = require('@koa/cors');
    app.use(cors());
    mainRouter.use((new ViewCountRouter()).getKoaRouter().routes())
  }

  mainRouter.get('/health', passAuthorizationMiddleware, ctx => {
    console.log('health');
    ctx.body = 'hi';
  });

  if (process.env.IS_VIEW_COUNT_SERVER) {
    console.log("yes");
    mainRouter.use((new ViewCountRouter()).getKoaRouter().routes())
  } else {
    const routers = [
      new UserApiRouter(),
      new PostApiRouter(),
      new BoardApiRouter(),
      new AuthenticationApiRouter(),
      new CommentApiRouter(),
      new MediaApiRouter(),
    ];

    routers.forEach((router) => {
      mainRouter.use(router.getKoaRouter().routes());
    })

    mainRouter.all('/graphql', passAuthorizationMiddleware, graphqlHTTP({
      schema,
      graphiql: isDevelopment,
    }));
  }

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
}
