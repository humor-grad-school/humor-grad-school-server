
export namespace RequestBodyType {

  export interface AuthenticateRequestBodyType {
    origin: string;
    authenticationRequestData: {
      idToken: string;
    };
  }

  export interface SignUpRequestBodyType {
    username: string;
    origin: string;
    authenticationRequestData: {
      idToken: string;
    };
  }

  export interface UpdateAvatarRequestBodyType {
    key: string;
  }

  export interface WritePostRequestBodyType {
    title: string;
    contentS3Key: string;
    boardName: string;
    thumbnailKey?: string;
  }

  export interface EncodeMediaRequestBodyType {
    s3Key: string;
  }

  export interface LikePostRequestBodyType {
    postId: number;
  }

  export interface CreateBoardRequestBodyType {
    boardName: string;
  }

  export interface WriteCommentRequestBodyType {
    contentS3Key: string;
    postId: number;
  }

  export interface LikeCommentRequestBodyType {
    commentId: number;
  }

  export interface WriteSubCommentRequestBodyType {
    parentCommentId: string;
    contentS3Key: string;
    postId: number;
  }

  export interface IncreaseViewCountRequestBodyType {
    postId: number;
  }
}
