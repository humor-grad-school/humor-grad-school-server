
export namespace ParamMap {
  export type BaseParamMap = {[key: string]: string};

  export type AuthenticateParamMap = {
    origin: string;
  };

  export type SignUpParamMap = {

  };

  export type RequestPresignedPostFieldsForAvatarParamMap = {

  };

  export type UpdateAvatarParamMap = {

  };

  export type WritePostParamMap = {

  };

  export type EncodeMediaParamMap = {
    s3Key: string;
  };

  export type LikePostParamMap = {
    postId: string;
  };

  export type CreateBoardParamMap = {
    boardName: string;
  };

  export type WriteCommentParamMap = {

  };

  export type LikeCommentParamMap = {
    commentId: string;
  };

  export type WriteSubCommentParamMap = {
    parentCommentId: string;
  };
}
