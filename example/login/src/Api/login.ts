import { is2xx } from '@/App';

export default async function login(authenticationRequestData, origin: string): Promise<string> {
  const response = await fetch(`http://localhost:8080/auth/${origin}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      authenticationRequestData,
    }),
  });

  if (is2xx(response)) {
    const { sessionToken } = await response.json();
    console.log('session token : ', sessionToken);
    return sessionToken;
  }
  const { errorCode } = await response.json();

  throw errorCode;
}