import { requestPost, request } from './test';

export default async function writeAndLikeCommentTest(postId) {
  const comment = await requestPost(`comment`, {
    contentS3Key: Math.random().toString(36).substr(2, 5),
    postId,
  });
  const comment2 = await request(`comment/${comment.id}`);
  console.log(comment2);

  await requestPost(`comment/${comment.id}/like`);
}
