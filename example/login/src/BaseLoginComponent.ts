import { Vue, Emit } from 'vue-property-decorator';
import { HgsRestApi } from './Api/generated/client/ClientApis';

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
    const result = await HgsRestApi.signUp({}, {
      username: this.username as string,
      origin: this.origin,
      authenticationRequestData: this.authenticationRequestData,
    });

    if (result.isSuccessful) {
      this.isNeedSignUp = false;
      return;
    }
    alert(`Failed for sign up : ${result.errorCode}`);
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
