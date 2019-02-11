
import { ErrorCode } from './ErrorCode';

export namespace ResponseDataType {

  export interface AuthenticateResponseDataType {
    sessionToken: string;
  }

  export interface WritePostResponseDataType {
    postId: number;
  }

  export interface RequestPresignedPostFieldsForContentResponseDataType {
    url: string;
    fields: { [key: string]: string };
    key: string;
  }

  export interface WriteCommentResponseDataType {
    commentId: number;
  }

  export interface WriteSubCommentResponseDataType {
    commentId: number;
  }

  export interface RequestPresignedPostFieldsForMediaResponseDataType {
    url: string;
    fields: { [key: string]: string };
    key: string;
  }
}

export namespace ResponseType {
  export interface NoDataResponseType {
    isSuccessful: boolean;
    errorCode?: string;
  }

  export interface BaseResponseType extends NoDataResponseType {
    data?: {};
  }

  export interface AuthenticateResponseType extends BaseResponseType {
    errorCode?: ErrorCode.AuthenticateErrorCode | ErrorCode.DefaultErrorCode;
    data?: ResponseDataType.AuthenticateResponseDataType;
  }

  export interface SignUpResponseType extends BaseResponseType {
    errorCode?: ErrorCode.SignUpErrorCode | ErrorCode.DefaultErrorCode;
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

  export interface RequestPresignedPostFieldsForContentResponseType extends NoDataResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
    data?: ResponseDataType.RequestPresignedPostFieldsForContentResponseDataType;
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

  export interface IncreaseViewCountResponseType extends BaseResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
  }

  export interface RequestPresignedPostFieldsForMediaResponseType extends NoDataResponseType {
    errorCode?: ErrorCode.DefaultErrorCode;
    data?: ResponseDataType.RequestPresignedPostFieldsForMediaResponseDataType;
  }
}
