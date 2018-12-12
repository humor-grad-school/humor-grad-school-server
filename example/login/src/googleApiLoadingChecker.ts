
let isGoogleApiLoaded = false;

// Check index.html
function onGoogleApiLoad() {
  console.warn('hi');
  isGoogleApiLoaded = true;
  handlers.forEach(func => func());
}
(window as any).onGoogleApiLoad = onGoogleApiLoad;

const handlers: Array<() => void> = [];
export function addGoogleApiLoadHandler(func: () => void) {
  handlers.push(func);
  if (isGoogleApiLoaded) {
    func();
  }
}

export function getGoogleApiLoaded() {
  return isGoogleApiLoaded;
}
