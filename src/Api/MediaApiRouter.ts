import { HgsRouterContext, BaseMediaApiRouter } from "./types/generated/server/ServerBaseApiRouter";
import { ParamMap } from "./types/generated/ParamMap";
import { RequestBodyType } from "./types/generated/RequestBodyType";
import { ResponseType } from './types/generated/ResponseType';
import { getConfiguration } from "@/configuration";
import s3Helper from "@/s3Helper";

const mediaSizeLimit = 10 * 1000 * 1000; // 10MB

export default class MediaApiRouter extends BaseMediaApiRouter {
  protected async requestPresignedPostFieldsForMedia(
    paramMap: ParamMap.RequestPresignedPostFieldsForMediaParamMap,
    body: RequestBodyType.RequestPresignedPostFieldsForMediaRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.RequestPresignedPostFieldsForMediaResponseType>
  {
    return {
      isSuccessful: true,
      data: await s3Helper.createPresignedPost(mediaSizeLimit, getConfiguration().BEFORE_ENCODING_S3_BUCKET),
    };
  }
}

