import { BasePostApiRouter, HgsRouterContext } from "./types/generated/server/ServerBaseApiRouter";
import { ParamMap } from "./types/generated/ParamMap";
import { RequestBodyType } from "./types/generated/RequestBodyType";
import { ResponseType } from './types/generated/ResponseType';
import BoardModel from "@/Model/BoardModel";
import PostModel from "@/Model/PostModel";
import { getConfiguration } from "@/configuration";
import router from "./CommentApiRouter";
import { transaction } from "objection";
import encode, { MediaSize } from "./encode/encode";
import { ErrorCode } from "./types/generated/ErrorCode";

export default class PostApiRouter extends BasePostApiRouter {
  protected async writePost(
    paramMap: ParamMap.WritePostParamMap,
    body: RequestBodyType.WritePostRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.WritePostResponseType> {
    const writerId = context.session.userId;

    // TODO: Get first image from post content, and make thumbnail.

    const board = await BoardModel.query().findOne({ name: body.boardName });

    const post = await PostModel.query().insert({
      title: body.title,
      contentS3Key: body.contentS3Key,
      writerId,
      boardId: board.id,
      thumbnailUrl: PostModel.defaultThumbnailUrl,
    });

    return {
      isSuccessful: true,
      data: {
        postId: post.id,
      },
    };
  }
  protected async encodeMedia(
    paramMap: ParamMap.EncodeMediaParamMap,
    body: RequestBodyType.EncodeMediaRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.EncodeMediaResponseType> {
    const {
      s3Key,
    } = paramMap;
    const postImageSize: MediaSize = {
      maxWidth: 1080,
    }
    await encode(s3Key, postImageSize, getConfiguration().AFTER_ENCODING_S3_BUCKET, s3Key);
    // TODO : return url of media
    return {
      isSuccessful: true,
    };
  }

  protected async likePost(
    paramMap: ParamMap.LikePostParamMap,
    body: RequestBodyType.LikePostRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.LikePostResponseType> {
    const { postId } = paramMap;

    const post = await PostModel.query().findById(postId);

    if (!post) {
      return {
        isSuccessful: false,
        errorCode: ErrorCode.LikePostErrorCode.NotFoundPost,
      };
    }

    const { userId } = context.session;
    await transaction(PostModel.knex(), async (trx) => {
      // If user already liked, then this query will day 'duplicated primary key'.
      await post.$relatedQuery('likers', trx).relate(userId);

      await post.$query(trx).increment('likes', 1);
    });

    return {
      isSuccessful: true,
    };
  }
}

// router.post('/:postId/like', async ctx => {
//   const { postId } = ctx.params;

//   const post = await PostModel.query().findById(postId);

//   if (!post) {
//     return ctx.status = 404;
//   }

//   const { userId } = ctx.session;
//   await transaction(PostModel.knex(), async (trx) => {
//     // If user already liked, then this query will day 'duplicated primary key'.
//     await post.$relatedQuery('likers', trx).relate(userId);

//     await post.$query(trx).increment('likes', 1);
//   });

//   ctx.status = 200;
// });

// export default router;
