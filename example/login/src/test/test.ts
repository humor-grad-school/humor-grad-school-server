import writeTest from './postTest';
import { is2xx } from '@/App';
import likePost from './likePost';
import { getSessionToken } from '@/utils/sessionToken';
import writeAndLikeCommentTest from './writeAndLikeCommentTest';

const serverUrl = 'http://localhost:8080';

export async function request(relativeUrl: string, method = 'GET', body: any = null) {
  const sessionToken = getSessionToken();

  const url = `${serverUrl}/${relativeUrl}`;

  const response = await fetch(url, {
    method,
    body: method === 'GET' ? null : JSON.stringify(body || {}),
    headers: {
      'content-type': 'application/json',
      'Authorization': `sessionToken ${sessionToken}`,
    },
  });

  const text = await response.text();

  if (!await is2xx(response)) {
    throw new Error(text);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

export function requestPost(relativeUrl, body: any = null) {
  return request(relativeUrl, 'POST', body);
}


export async function check2xx(response: Response) {
  if (response.status >= 200 || response.status < 300) {
    return;
  } else {
    const json = await response.json();
    throw new Error(json);
  }
}


export async function runTest() {
  const post = await writeTest();
  await likePost(post.id);
  await writeAndLikeCommentTest(post.id);
}
