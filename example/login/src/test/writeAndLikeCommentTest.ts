import { HgsRestApi } from '@/Api/generated/client/ClientApis';

export default async function writeAndLikeCommentTest(postId) {
  const response = await HgsRestApi.writeComment({
    contentS3Key: Math.random().toString(36).substr(2, 5),
    postId,
  });
  if (!response.isSuccessful) {
    console.error(response);
    throw new Error('fail writeComment');
  }

  const { commentId } = response.data;

  await HgsRestApi.writeSubComment({
    parentCommentId: commentId.toString(),
    contentS3Key: Math.random().toString(36).substr(2, 5),
    postId,
  });

  await HgsRestApi.likeComment({
    commentId,
  });
}
