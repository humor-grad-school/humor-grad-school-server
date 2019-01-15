
export namespace RequestBodyType {
  export interface BaseRequestBodyType {
  }

  export interface AuthenticateRequestBodyType extends BaseRequestBodyType {
    authenticationRequestData: {
      idToken: string;
    }
  }

  export interface SignUpRequestBodyType extends BaseRequestBodyType {
    username: string;
    origin: string;
    authenticationRequestData: {
      idToken: string;
    }
  }

  export interface RequestPresignedPostFieldsForAvatarRequestBodyType extends BaseRequestBodyType {

  }

  export interface UpdateAvatarRequestBodyType extends BaseRequestBodyType {
    key: string;
  }

  export interface WritePostRequestBodyType extends BaseRequestBodyType {
    title: string;
    contentS3Key: string;
    boardName: string;
  }

  export interface EncodeMediaRequestBodyType extends BaseRequestBodyType {

  }

  export interface LikePostRequestBodyType extends BaseRequestBodyType {

  }

  export interface CreateBoardRequestBodyType extends BaseRequestBodyType {

  }

  export interface WriteCommentRequestBodyType extends BaseRequestBodyType {
    contentS3Key: string;
    postId: number;
  }

  export interface LikeCommentRequestBodyType extends BaseRequestBodyType {

  }

  export interface WriteSubCommentRequestBodyType extends BaseRequestBodyType {
    contentS3Key: string;
    postId: number;
  }
}
