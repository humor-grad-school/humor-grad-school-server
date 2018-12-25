let sessionToken;

export function saveSessionToken(newSessionToken) {
  sessionToken = newSessionToken;
}

export function getSessionToken() {
  return sessionToken;
}
