import { Component } from 'vue-property-decorator';
import BaseLoginComponent from '@/BaseLoginComponent';
import loadFacebookSdk from './loadFacebookSdk';

declare var FB: any;

@Component
export default class FacebookLoginComponent extends BaseLoginComponent {
  public origin: string = 'facebook';

  public mounted() {
    loadFacebookSdk().then(() => {
      console.log('facebook loaded');
      FB.getLoginStatus((response) => {
        console.log(response);
        if (response.status === 'connected') {
          this.onThirdPartyLoginSuccessful({
            idToken: response.authResponse.accessToken,
          });
        } else {
          console.error(response);
          this.onThirdPartyLoginFailed();
        }
      });
    });
  }
}
