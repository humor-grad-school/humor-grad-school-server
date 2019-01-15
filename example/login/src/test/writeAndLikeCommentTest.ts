import { HgsRestApi } from '@/Api/generated/client/ClientApis';

export default async function writeAndLikeCommentTest(postId) {
  const commentId = HgsRestApi.writeComment({}, {
    contentS3Key: Math.random().toString(36).substr(2, 5),
    postId,
  });
  const subCommentId = HgsRestApi.writeSubComment({
    parentCommentId: commentId.toString(),
  }, {
    contentS3Key: Math.random().toString(36).substr(2, 5),
    postId,
  });

  await HgsRestApi.likeComment({
    commentId: commentId.toString(),
  }, {});
}
