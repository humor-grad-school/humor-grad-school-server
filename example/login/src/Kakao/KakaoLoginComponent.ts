import { Component } from 'vue-property-decorator';
import loadKakaoSdk from './loadKakaoSdk';
import BaseLoginComponent from '@/BaseLoginComponent';

declare var Kakao: any;

@Component
export default class KakaoLoginComponent extends BaseLoginComponent {
  public origin: string = 'kakao';
  public isKakaoApiLoaded = false;
  public loginButtonElementId = 'kakao-login-btn';

  public mounted() {
    loadKakaoSdk().then(() => {
      console.log('kakao loaded');
      this.isKakaoApiLoaded = true;
      Kakao.Auth.createLoginButton({
        container: '#kakao-login-btn',
        success: (authObj: any) => {
          const {
            access_token: accessToken,
          } = authObj;
          // {
          //   access_token: "...",
          //   refresh_token: "...",
          //   token_type: "bearer",
          //   expires_in: 43199,
          //   scope: "Basic_Profile",
          // }
          // Remember, Kakao is Oauth 2.0 but works like openId
          this.onThirdPartyLoginSuccessful({
            idToken: accessToken,
          });
        },
        fail: (err: any) => {
          console.error(err);
          this.onThirdPartyLoginFailed();
        }
      });
    });
  }
}
