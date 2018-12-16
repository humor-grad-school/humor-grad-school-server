import loadExternalJsASync from '@/utils/loadExternalJsASync';

let promise: Promise<any>;
declare var Kakao: any;

const id = 'kakao-jssdk';
export default function loadKakaoSdk() {
  if (!promise) {
    promise = loadExternalJsASync(id, '//developers.kakao.com/sdk/js/kakao.min.js')
      .then(() => {
        Kakao.init('9961b823fe0a81d417fe53fb96b12fa6');
      });
  }
  return promise;
}