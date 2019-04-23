import { HgsRouterContext, BaseCommentApiRouter } from "./types/generated/server/ServerBaseApiRouter";
import { ResponseType } from './types/generated/ResponseType';
import CommentModel from "@/Model/CommentModel";
import { transaction } from "objection";
import { ErrorCode } from "./types/generated/ErrorCode";

export default class CommentApiRouter extends BaseCommentApiRouter {
  protected async writeComment(
    context: HgsRouterContext,
    contentS3Key: string,
    postId: number,
  ): Promise<ResponseType.WriteCommentResponseType> {
    const { userId } = context.session;

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
    context: HgsRouterContext,
    commentId: number,
  ): Promise<ResponseType.LikeCommentResponseType> {
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
    context: HgsRouterContext,
    parentCommentId: number,
    contentS3Key: string,
    postId: number,
  ): Promise<ResponseType.WriteSubCommentResponseType> {
    const { userId } = context.session;

    const comment = await CommentModel.query().insert({
      writerId: userId,
      contentS3Key,
      postId,
      parentCommentId,
    });
    return {
      isSuccessful: true,
      data: {
        commentId: comment.id,
      },
    };
  }
}
