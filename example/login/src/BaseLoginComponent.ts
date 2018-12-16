import { Vue, Emit } from 'vue-property-decorator';
import { is2xx } from './App';

export default abstract class BaseLoginComponent extends Vue {
  public isLoginFinished: boolean = false;
  public isLoginSuccessful: boolean = false;
  public isNeedSignUp: boolean = false;
  public username?: string = '';
  protected authenticationRequestData: any;

  public async signOut() {
    this.isLoginFinished = false;
    this.isLoginSuccessful = false;
  }

  abstract get origin(): string;
  @Emit('login-humor')
  public loginToHumor() {
    return {
      authenticationRequestData: this.authenticationRequestData,
      origin: this.origin,
    };
  }

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
      return;
    }

    const body = await response.json();

    // TODO : Error Handling
    alert(`Failed for sign up : ${JSON.stringify(body, null, 2)}`);
  }

  protected onThirdPartyLoginSuccessful(authenticationRequestData: any) {
    this.authenticationRequestData = authenticationRequestData;
    this.isLoginFinished = true;
    this.isLoginSuccessful = true;
    this.loginToHumor();
  }

  protected onThirdPartyLoginFailed() {
    this.isLoginFinished = true;
    this.isLoginSuccessful = false;
  }
}
