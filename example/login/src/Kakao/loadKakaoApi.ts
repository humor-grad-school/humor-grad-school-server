let promise: Promise<any>;
declare var Kakao: any;

export default function loadKakaoApi() {
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const id = 'kakao-jssdk';
      if (document.getElementById(id)) {
        return reject('kakao sdk loading has been already started');
      }
      const scriptElement: HTMLScriptElement = document.createElement('script');
      scriptElement.id = id;
      scriptElement.src = '//developers.kakao.com/sdk/js/kakao.min.js';
      // tslint:disable-next-line:only-arrow-functions
      scriptElement.onload = function() {
        Kakao.init('9961b823fe0a81d417fe53fb96b12fa6');
        resolve();
      };
      const firstScriptElement = document.getElementsByTagName('script')[0];
      if (!firstScriptElement || !firstScriptElement.parentNode) {
        return reject('cannot insert script');
      }
      firstScriptElement.parentNode.insertBefore(scriptElement, firstScriptElement);
    });
  }
  return promise;
}
