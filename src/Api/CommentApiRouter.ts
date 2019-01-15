import { HgsRouterContext, BaseCommentApiRouter } from "./types/generated/server/ServerBaseApiRouter";
import { ParamMap } from "./types/generated/ParamMap";
import { RequestBodyType } from "./types/generated/RequestBodyType";
import { ResponseType } from './types/generated/ResponseType';
import CommentModel from "@/Model/CommentModel";
import { transaction } from "objection";
import { ErrorCode } from "./types/generated/ErrorCode";

export default class CommentApiRouter extends BaseCommentApiRouter {
  protected async writeComment(
    paramMap: ParamMap.WriteCommentParamMap,
    body: RequestBodyType.WriteCommentRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.WriteCommentResponseType> {
    const { userId } = context.session;
    const {
      postId,
      contentS3Key,
    } = body;

    const comment = await CommentModel.query().insert({
      writerId: userId,
      contentS3Key,
      postId,
    });
    return {
      isSuccessful: true,
      data: {
        commentId: comment.id,
      },
    }
  }

  protected async likeComment(
    paramMap: ParamMap.LikeCommentParamMap,
    body: RequestBodyType.LikeCommentRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.LikeCommentResponseType> {
    const { commentId } = paramMap;
    const { userId } = context.session;

    const comment = await CommentModel.query().findById(commentId);

    if (!comment) {
      return {
        isSuccessful: false,
        errorCode: ErrorCode.LikeCommentErrorCode.NotFoundComment,
      };
    }

    await transaction(CommentModel.knex(), async (trx) => {
      // If user already liked, then this query will day 'duplicated primary key'.
      await comment.$relatedQuery('likers', trx).relate(userId);

      await comment.$query(trx).increment('likes', 1);
    });

    return {
      isSuccessful: true,
    }
  }

  protected async writeSubComment(
    paramMap: ParamMap.WriteSubCommentParamMap,
    body: RequestBodyType.WriteSubCommentRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.WriteSubCommentResponseType> {
    const { parentCommentId } = paramMap;
    const {
      contentS3Key,
      postId,
    } = body;

    await CommentModel.query().insert({
      writerId: context.session.userId,
      contentS3Key,
      postId,
      parentCommentId: parseInt(parentCommentId, 10),
    });
    return {
      isSuccessful: true,
    };
  }
}
