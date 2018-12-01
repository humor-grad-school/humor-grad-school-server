import fetch from 'node-fetch';
import check2xx from './check2xx';

const serverUrl = 'http://localhost:8080';

async function request(relativeUrl, method = 'GET', body = null) {
  const response = await fetch(`${serverUrl}/${relativeUrl}`, {
    method,
    body: method === 'GET' || !body ? undefined : JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  });
  await check2xx(response);

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

function requestPost(relativeUrl, body = null) {
  return request(relativeUrl, 'POST', body);
}

function createUser() {
  const username = Math.random().toString(36).substr(2, 5);
  console.log(`username: ${username}`);
  return requestPost('user', {
    username,
  });
}

function createBoard() {
  return requestPost(`board/${Math.random().toString(36).substr(2, 5)}`);
}

function createPost(writerId, boardName) {
  const title = Math.random().toString(36).substr(2, 5);
  const contentS3Key = Math.random().toString(36).substr(2, 5);
  console.log(`title: ${title}`);
  console.log(`contentS3Key: ${contentS3Key}`);
  return requestPost(`post`, {
    writerId,
    title,
    contentS3Key,
    boardName,
  });
}

function getBoard(boardName) {
  return request(`board/${boardName}`);
}

export default async function writeTest() {
  const { id: userId } = await createUser();

  const { name: boardName } = await createBoard();

  console.log(`boardName : ${boardName}`);

  const post = await createPost(userId, boardName);
  console.log(post);

  const board = await getBoard(boardName);
  console.log(board);
}
