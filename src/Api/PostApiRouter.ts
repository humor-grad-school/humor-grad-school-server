import { BasePostApiRouter, HgsRouterContext } from "./types/generated/server/ServerBaseApiRouter";
import { RequestBodyType } from "./types/generated/RequestBodyType";
import { ResponseType } from './types/generated/ResponseType';
import BoardModel from "@/Model/BoardModel";
import PostModel from "@/Model/PostModel";
import { getConfiguration } from "@/configuration";
import { transaction } from "objection";
import encode, { MediaSize } from "./encode/encode";
import { ErrorCode } from "./types/generated/ErrorCode";
import s3Helper from "@/s3Helper";

export default class PostApiRouter extends BasePostApiRouter {
  protected async writePost(
    context: HgsRouterContext,
    title: string,
    contentS3Key: string,
    boardName: string,
    thumbnailKey?: string,
  ): Promise<ResponseType.WritePostResponseType> {
    const writerId = context.session.userId;

    // TODO: Get first image from post content, and make thumbnail.

    const board = await BoardModel.query().findOne({ name: boardName });

    const post = await PostModel.query().insert({
      title: title,
      contentS3Key: contentS3Key,
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
    context: HgsRouterContext,
    s3Key: string,
  ): Promise<ResponseType.EncodeMediaResponseType> {
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
    context: HgsRouterContext,
    postId: number,
  ): Promise<ResponseType.LikePostResponseType> {

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
  protected async requestPresignedPostFieldsForContent(
    context: HgsRouterContext
  ): Promise<ResponseType.RequestPresignedPostFieldsForContentResponseType> {
    return {
      isSuccessful: true,
      data: await s3Helper.createPresignedPost(PostModel.contentSizeLimit, getConfiguration().CONTENT_S3_BUCKET),
    };
  }
}
