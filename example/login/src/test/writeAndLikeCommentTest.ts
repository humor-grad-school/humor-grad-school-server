import { requestPost, request } from './test';

export default async function writeAndLikeCommentTest(postId) {
  const comment = await requestPost(`post/${postId}/comment`, {
    contentS3Key: Math.random().toString(36).substr(2, 5),
  });
  const comment2 = await request(`post/comment/${comment.id}`);
  console.log(comment2);

  await requestPost(`post/comment/${comment.id}/like`);
}
