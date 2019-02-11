import { HgsRouterContext, BaseViewCountApiRouter } from "./types/generated/server/ServerBaseApiRouter";
import { ResponseType } from "./types/generated/ResponseType";
import ViewCountService from "./ViewCountService/ViewCountService";

export default class ViewCountApiRouter extends BaseViewCountApiRouter {
  private viewCountService = new ViewCountService();
  constructor() {
    super();
    this.viewCountService.runFlushInterval();
  }
  protected async increaseViewCount(
    context: HgsRouterContext,
    postId: number,
  ): Promise<ResponseType.IncreaseViewCountResponseType> {
    const { session, ip } = context;
    const userId = session ? session.userId : undefined;

    this.viewCountService.saveViewCount(postId, ip, userId)
      .catch((err) => {
        console.error(`fail to save view count : ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
      });

    return {
      isSuccessful: true,
    };
  }
}
