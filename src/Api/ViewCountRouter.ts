import ViewCountService from "./ViewCountService/ViewCountService";
import Router from 'koa-router';
import { passAuthorizationMiddleware } from "./types/generated/server/ServerBaseApiRouter";

export default class ViewCountRouter extends Router {
  private viewCountService = new ViewCountService();
  constructor(opt?: Router.IRouterOptions) {
    super(opt);

    this.viewCountService.runFlushInterval();

    this.post('/view', passAuthorizationMiddleware, async ctx => {
      let { postId } = ctx.params;
      postId = parseInt(postId);
      const { session, ip } = ctx;
      const userId = session ? session.userId : undefined;

      this.viewCountService.saveViewCount(postId, ip, userId)
        .catch((err) => {
          console.error(`fail to save view count : ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
        });

      ctx.response.status = 200;
    });
  }
}
