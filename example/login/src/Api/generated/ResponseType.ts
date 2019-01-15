
import { ErrorCode } from './ErrorCode';

export namespace ResponseDataType {
  export interface BaseResponseDataType {

  }

  export interface AuthenticateResponseDataType {
    sessionToken: string;
  }

  export interface SignUpResponseDataType {

  }

  export interface RequestPresignedPostFieldsForAvatarResponseDataType {
    url: string;
    fields: { [key: string]: string }
    key: string;
  }

  export interface UpdateAvatarResponseDataType {

  }

  export interface WritePostResponseDataType {
    postId: number;
  }

  export interface EncodeMediaResponseDataType {

  }

  export interface LikePostResponseDataType {

  }

  export interface CreateBoardResponseDataType {

  }

  export interface WriteCommentResponseDataType {
    commentId: number;
  }

  export interface LikeCommentResponseDataType {

  }

  export interface WriteSubCommentResponseDataType {
    commentId: number;
  }
}

export namespace ResponseType {
  export interface BaseResponseType {
    isSuccessful: boolean;
    errorCode?: string;
    data?: {};
  }
  export interface DefaultResponseType extends BaseResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
  }

  export interface AuthenticateResponseType extends BaseResponseType {
    errorCode?: ErrorCode.AuthenticateErrorCode | ErrorCode.DefaultErrorCode;
    data?: ResponseDataType.AuthenticateResponseDataType;
  }

  export interface SignUpResponseType extends BaseResponseType {
    errorCode?: ErrorCode.SignUpErrorCode | ErrorCode.DefaultErrorCode;
  }

  export interface RequestPresignedPostFieldsForAvatarResponseType extends BaseResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
    data?: ResponseDataType.RequestPresignedPostFieldsForAvatarResponseDataType;
  }

  export interface UpdateAvatarResponseType extends BaseResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
  }

  export interface WritePostResponseType extends BaseResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
    data?: ResponseDataType.WritePostResponseDataType;
  }

  export interface EncodeMediaResponseType extends BaseResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
  }

  export interface LikePostResponseType extends BaseResponseType {
    errorCode?: ErrorCode.LikePostErrorCode | ErrorCode.DefaultErrorCode;
  }

  export interface CreateBoardResponseType extends BaseResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
  }

  export interface WriteCommentResponseType extends BaseResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
    data?: ResponseDataType.WriteCommentResponseDataType;
  }

  export interface LikeCommentResponseType extends BaseResponseType {
    errorCode?: ErrorCode.LikeCommentErrorCode | ErrorCode.DefaultErrorCode;
  }

  export interface WriteSubCommentResponseType extends BaseResponseType {
    errorCode?: ErrorCode.WriteSubCommentErrorCode | ErrorCode.DefaultErrorCode;
    data?: ResponseDataType.WriteSubCommentResponseDataType;
  }
}