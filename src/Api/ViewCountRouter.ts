import { HgsRouterContext, BaseViewCountApiRouter } from "./types/generated/server/ServerBaseApiRouter";
import { ParamMap } from "./types/generated/ParamMap";
import { ResponseType } from "./types/generated/ResponseType";
import { RequestBodyType } from "./types/generated/RequestBodyType";
import ViewCountService from "./ViewCountService/ViewCountService";

export default class ViewCountApiRouter extends BaseViewCountApiRouter {
  private viewCountService = new ViewCountService();
  constructor() {
    super();
    this.viewCountService.runFlushInterval();
  }
  protected async increaseViewCount(
    paramMap: ParamMap.IncreaseViewCountParamMap,
    body: RequestBodyType.IncreaseViewCountRequestBodyType,
    context: HgsRouterContext
  ): Promise<ResponseType.IncreaseViewCountResponseType> {
    let { postId } = paramMap;
    const { session, ip } = context;
    const userId = session ? session.userId : undefined;

    this.viewCountService.saveViewCount(parseInt(postId), ip, userId)
      .catch((err) => {
        console.error(`fail to save view count : ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
      });

    return {
      isSuccessful: true,
    };
  }
}
