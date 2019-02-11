import { HgsRestApi } from '@/Api/generated/client/ClientApis';

// async function createBoard() {
//   const boardName = Math.random().toString(36).substr(2, 5);
//   await HgsRestApi.createBoard({
//     boardName,
//   }, {});
//   return boardName;
// }

async function createPost(boardName): Promise<number> {
  const title = Math.random().toString(36).substr(2, 5);
  const contentS3Key = Math.random().toString(36).substr(2, 5);
  console.log(`title: ${title}`);
  console.log(`contentS3Key: ${contentS3Key}`);
  const response = await HgsRestApi.writePost({
    boardName,
    contentS3Key,
    title,
  });

  if (!response.isSuccessful) {
    throw new Error('fail to create post');
  }

  return response.data.postId;
}

export default async function writeTest(): Promise<number> {
  const boardName = 'humor';

  console.log(`boardName : ${boardName}`);

  const postId = await createPost(boardName);
  console.log(postId);

  return postId;
}
