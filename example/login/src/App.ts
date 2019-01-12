import { Component, Vue } from 'vue-property-decorator';

import KakaoLoginComponent from './Kakao/KakaoLoginComponent.vue';
import FacebookLoginComponent from './Facebook/FacebookLoginComponent.vue';
import login from './Api/login';
import { ErrorCode } from '../../../src/Api/ErrorCode';
import { runTest } from './test/test';
import Avatar from './Avatar/Avatar.vue';

export function is2xx(response: Response) {
  return response.status >= 200 && response.status < 300;
}

@Component({
  components: {
    KakaoLoginComponent,
    FacebookLoginComponent,
    Avatar,
  },
})
export default class App extends Vue {
  public isNeedSignUp = false;
  public authenticationRequestData: any;
  public origin: string = '';
  public username: string = '';
  public isLoginSuccessful = false;

  public async signUp() {
    const response = await fetch('http://localhost:8080/user', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: this.username,
        origin: this.origin,
        authenticationRequestData: this.authenticationRequestData,
      }),
    });

    if (is2xx(response)) {
      this.isNeedSignUp = false;
      return this.loginToHumor({
        origin: this.origin,
        authenticationRequestData: this.authenticationRequestData,
      });
    }

    const body = await response.json();

    // TODO : Error Handling
    alert(`Failed for sign up : ${JSON.stringify(body, null, 2)}`);
  }

  public async loginToHumor(  {
    authenticationRequestData,
    origin,
  }: {
    authenticationRequestData: any,
    origin: string,
  }) {
    this.authenticationRequestData = authenticationRequestData;
    this.origin = origin;
    try {
      await login(this.authenticationRequestData, this.origin);
      this.isLoginSuccessful = true;
    } catch(errorCode) {
      console.error(errorCode);
      switch (errorCode) {
        case ErrorCode.AuthenticateErrorCode.NoUser: {
          this.isNeedSignUp = true;
          break;
        }
        case ErrorCode.AuthenticateErrorCode.AuthenticationFailed: {
          alert('Authentication Failed. Try Again!');
          break;
        }
        default: {
          // internal error
          alert('Internal Error. Try Again!');
          console.warn(errorCode);
          break;
        }
      }
    }
  }

  public async runTest() {
    await runTest();
  }
}
