import { HgsRouterContext, BaseBoardApiRouter } from "./types/generated/server/ServerBaseApiRouter";
import { ResponseType } from './types/generated/ResponseType';
import BoardModel from "@/Model/BoardModel";
import { isDevelopment } from "..";

export default class BoardApiRouter extends BaseBoardApiRouter {
  protected async createBoard(
    context: HgsRouterContext,
    boardName: string,
  ): Promise<ResponseType.CreateBoardResponseType> {

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
