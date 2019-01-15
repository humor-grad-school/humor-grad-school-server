import { HgsRouterContext, BaseBoardApiRouter } from "./types/generated/server/ServerBaseApiRouter";
import { ParamMap } from "./types/generated/ParamMap";
import { RequestBodyType } from "./types/generated/RequestBodyType";
import { ResponseType } from './types/generated/ResponseType';
import BoardModel from "@/Model/BoardModel";
import { isDevelopment } from "..";

export default class BoardApiRouter extends BaseBoardApiRouter {
  protected async createBoard(
    paramMap: ParamMap.CreateBoardParamMap,
    body: RequestBodyType.CreateBoardRequestBodyType,
    context: HgsRouterContext
  ): Promise<ResponseType.CreateBoardResponseType> {
    const { boardName } = paramMap;

    if (!isDevelopment) {
      return {
        isSuccessful: false,
      };
    }

    const board = await BoardModel.query().insert({
      name: boardName,
    });

    return {
      isSuccessful: true,
    };
  }
}
