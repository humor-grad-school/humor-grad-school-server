import ViewCountService from "./ViewCountService/ViewCountService";
import Router from 'koa-router';
import { passAuthorizationMiddleware } from "./AuthorizationPassService";

const viewCountService = new ViewCountService();
const viewCountRouter = new Router();

viewCountRouter.post('/:postId', passAuthorizationMiddleware, async ctx => {
  let { postId } = ctx.params;
  postId = parseInt(postId);
  const { session, ip } = ctx;
  const userId = session ? session.userId : undefined;

  viewCountService.saveViewCount(postId, ip, userId)
    .catch((err) => {
      console.error(`fail to save view count : ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
    });

  ctx.response.status = 200;
});

export default viewCountRouter;
