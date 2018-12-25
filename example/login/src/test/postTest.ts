import { requestPost, request } from './test';

function createBoard() {
  return requestPost(`board/${Math.random().toString(36).substr(2, 5)}`);
}

function createPost(boardName) {
  const title = Math.random().toString(36).substr(2, 5);
  const contentS3Key = Math.random().toString(36).substr(2, 5);
  console.log(`title: ${title}`);
  console.log(`contentS3Key: ${contentS3Key}`);
  return requestPost(`post`, {
    title,
    contentS3Key,
    boardName,
  });
}

function getBoard(boardName) {
  return request(`board/${boardName}`);
}

export default async function writeTest() {
  const { name: boardName } = await createBoard();

  console.log(`boardName : ${boardName}`);

  const board = await getBoard(boardName);
  console.log(board);

  const post = await createPost(boardName);
  console.log(post);

  return post;
}
