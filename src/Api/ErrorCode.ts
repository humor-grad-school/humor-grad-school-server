export namespace ErrorCode {
  export enum UserCreateErrorCode {
    WrongUserName = 'WrongUserName',
  };

  export enum AuthenticateErrorCode {
    WrongIdentityType = 'WrongIdentityType',
    NoUser = 'NoUser',
    AuthenticationFailed = 'AuthenticationFailed',
  };

  export enum PostLikeErrorCode {
    AlreadyLiked = 'AlreadyLiked',
  };
}

