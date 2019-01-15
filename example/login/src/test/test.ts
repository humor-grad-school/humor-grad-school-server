import writeTest from './postTest';
import likePost from './likePost';
import writeAndLikeCommentTest from './writeAndLikeCommentTest';

export async function check2xx(response: Response) {
  if (response.status >= 200 || response.status < 300) {
    return;
  } else {
    const json = await response.json();
    throw new Error(json);
  }
}


export async function runTest() {
  const postId = await writeTest();
  await likePost(postId);
  await writeAndLikeCommentTest(postId);
  await writeAndLikeCommentTest(postId);
  await writeAndLikeCommentTest(postId);
  await writeAndLikeCommentTest(postId);
  await writeAndLikeCommentTest(postId);
  await writeAndLikeCommentTest(postId);
  await writeAndLikeCommentTest(postId);
}
