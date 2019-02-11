
export namespace ErrorCode {
  export enum DefaultErrorCode {
    InternalServerError = 'InternalServerError',
  }
  export enum AuthenticateErrorCode {
    WrongIdentityType = 'WrongIdentityType',
    NoUser = 'NoUser',
    AuthenticationFailed = 'AuthenticationFailed',
  }
  export enum SignUpErrorCode {
    WrongOrigin = 'WrongOrigin',
    AuthenticationFailed = 'AuthenticationFailed',
    NoIdentity = 'NoIdentity',
    CreateUserFailed = 'CreateUserFailed',
  }
  export enum LikePostErrorCode {
    NotFoundPost = 'NotFoundPost',
  }
  export enum LikeCommentErrorCode {
    NotFoundComment = 'NotFoundComment',
  }
  export enum WriteSubCommentErrorCode {
    NotFoundParentComment = 'NotFoundParentComment',
  }
}
