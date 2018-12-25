import writeTest from './postTest';
import { is2xx } from '@/App';
import likePost from './likePost';
import { getSessionToken } from '@/utils/sessionToken';

const serverUrl = 'http://localhost:8080';

export async function request(relativeUrl: string, method = 'GET', body: any = null) {
  const sessionToken = getSessionToken();

  let bodyString: any;

  if (method === 'GET') {
    bodyString = null;
  } else {
    const newBody = body || {};
    newBody.sessionToken = sessionToken;

    bodyString = JSON.stringify(newBody);
  }

  console.log(bodyString);

  const url = relativeUrl.includes('?')
    ? `${serverUrl}/${relativeUrl}&sessionToken=${sessionToken}`
    : `${serverUrl}/${relativeUrl}?sessionToken=${sessionToken}`;

  const response = await fetch(url, {
    method,
    body: bodyString,
    headers: {
      'content-type': 'application/json',
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
}
