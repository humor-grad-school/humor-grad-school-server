
import Router from 'koa-router';
import { ResponseType } from '../ResponseType';
import { ErrorCode } from '../ErrorCode';
import { ParamMap } from '../ParamMap';
import { RequestBodyType } from '../RequestBodyType';

export interface Session {
  userId: number;
}

export interface HgsRouterContext {
  session: Session;
  ip: string;
}

export type HgsRouterHandler = (
  paramMap: {[key: string]: any},
  body: {[key: string]: any},
  context: HgsRouterContext,
) => Promise<ResponseType.BaseResponseType>;

export async function passAuthorizationMiddleware(ctx, next) {
  return await next();
}

interface HandlersInfo {
  handler: HgsRouterHandler;
  method: string;
  url: string;
  passAuth: boolean;
}

abstract class HgsRouter {
  protected readonly handlersInfos: HandlersInfo[];
  getKoaRouter(): Router {
    const router = new Router();
    this.handlersInfos.forEach(info => {
      const {
        handler,
        method,
        url,
        passAuth,
      } = info;
      router[method.toLowerCase()](url, passAuth ? passAuthorizationMiddleware : (_, next) => next(), async (ctx, next) => {
        try {
          const response = await handler(ctx.params, ctx.request.body, ctx);
          ctx.response.body = response;
        } catch(error) {
          // TODO
          ctx.response.body = {
            isSuccessful: false,
            errorCode: ErrorCode.DefaultErrorCode.InternalServerError,
          };
        }
      });
    });

    return router;
  }
}

export abstract class BaseAuthenticationApiRouter extends HgsRouter {
  protected readonly handlersInfos: HandlersInfo[] = [
    {
      handler: this.authenticate,
      method: 'POST',
      url: '/auth/:origin',
      passAuth: true,
    },
  ];

  protected abstract async authenticate(
    paramMap: ParamMap.AuthenticateParamMap,
    body: RequestBodyType.AuthenticateRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.AuthenticateResponseType>;
}

export abstract class BaseUserApiRouter extends HgsRouter {
  protected readonly handlersInfos: HandlersInfo[] = [
    {
      handler: this.signUp,
      method: 'POST',
      url: '/user',
      passAuth: true,
    },

    {
      handler: this.requestPresignedPostFieldsForAvatar,
      method: 'GET',
      url: '/user/avatar/presignedPost',
      passAuth: false,
    },

    {
      handler: this.updateAvatar,
      method: 'PUT',
      url: '/user/avatar',
      passAuth: false,
    },
  ];

  protected abstract async signUp(
    paramMap: ParamMap.SignUpParamMap,
    body: RequestBodyType.SignUpRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.SignUpResponseType>;

  protected abstract async requestPresignedPostFieldsForAvatar(
    paramMap: ParamMap.RequestPresignedPostFieldsForAvatarParamMap,
    body: RequestBodyType.RequestPresignedPostFieldsForAvatarRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.RequestPresignedPostFieldsForAvatarResponseType>;

  protected abstract async updateAvatar(
    paramMap: ParamMap.UpdateAvatarParamMap,
    body: RequestBodyType.UpdateAvatarRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.UpdateAvatarResponseType>;
}

export abstract class BasePostApiRouter extends HgsRouter {
  protected readonly handlersInfos: HandlersInfo[] = [
    {
      handler: this.writePost,
      method: 'POST',
      url: '/post',
      passAuth: false,
    },

    {
      handler: this.encodeMedia,
      method: 'POST',
      url: '/post/encode/:s3Key',
      passAuth: false,
    },

    {
      handler: this.likePost,
      method: 'POST',
      url: '/post/:postId/like',
      passAuth: false,
    },
  ];

  protected abstract async writePost(
    paramMap: ParamMap.WritePostParamMap,
    body: RequestBodyType.WritePostRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.WritePostResponseType>;

  protected abstract async encodeMedia(
    paramMap: ParamMap.EncodeMediaParamMap,
    body: RequestBodyType.EncodeMediaRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.EncodeMediaResponseType>;

  protected abstract async likePost(
    paramMap: ParamMap.LikePostParamMap,
    body: RequestBodyType.LikePostRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.LikePostResponseType>;
}

export abstract class BaseBoardApiRouter extends HgsRouter {
  protected readonly handlersInfos: HandlersInfo[] = [
    {
      handler: this.createBoard,
      method: 'POST',
      url: '/board/:boardName',
      passAuth: false,
    },
  ];

  protected abstract async createBoard(
    paramMap: ParamMap.CreateBoardParamMap,
    body: RequestBodyType.CreateBoardRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.CreateBoardResponseType>;
}

export abstract class BaseCommentApiRouter extends HgsRouter {
  protected readonly handlersInfos: HandlersInfo[] = [
    {
      handler: this.writeComment,
      method: 'POST',
      url: '/comment',
      passAuth: false,
    },

    {
      handler: this.likeComment,
      method: 'POST',
      url: '/comment/:commentId/like',
      passAuth: false,
    },

    {
      handler: this.writeSubComment,
      method: 'POSt',
      url: '/comment/:parentCommentId',
      passAuth: false,
    },
  ];

  protected abstract async writeComment(
    paramMap: ParamMap.WriteCommentParamMap,
    body: RequestBodyType.WriteCommentRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.WriteCommentResponseType>;

  protected abstract async likeComment(
    paramMap: ParamMap.LikeCommentParamMap,
    body: RequestBodyType.LikeCommentRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.LikeCommentResponseType>;

  protected abstract async writeSubComment(
    paramMap: ParamMap.WriteSubCommentParamMap,
    body: RequestBodyType.WriteSubCommentRequestBodyType,
    context: HgsRouterContext,
  ): Promise<ResponseType.WriteSubCommentResponseType>;
}
