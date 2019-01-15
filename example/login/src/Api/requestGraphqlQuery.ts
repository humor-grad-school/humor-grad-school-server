import { HgsRestApi } from './generated/client/ClientApis';

const serverUrl = 'http://localhost:8080';

export async function request(relativeUrl: string, method = 'GET', body: any = null) {
  const sessionToken = localStorage.getItem('sessionToken');

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

  if (!await HgsRestApi.is2xx(response)) {
    throw new Error(text);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

export default async function requestGraphqlQuery(query: string) {
  const { data } = await request('graphql', 'POST', {
    query,
  });
  return data;
}
