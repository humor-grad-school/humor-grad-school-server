import { Component, Vue } from 'vue-property-decorator';
import { getGoogleApiLoaded, addGoogleApiLoadHandler } from './googleApiLoadingChecker';

@Component
export default class App extends Vue {
  public isGoogleApiLoaded = getGoogleApiLoaded();
  public googleLoginWrapperId = 'google-button';
  public isLoginFinished: boolean = false;
  public isLoginSuccessful: boolean = false;
  public googleUser?: gapi.auth2.GoogleUser;
  public googleLoginError?: string;

  public mounted() {
    // YOU MUST USE BELOW CODE IN MOUNTED. Because it need HTML DOM with id googleLoginWrapperId.
    // addGoogleApiLoadHandler call callback function immediately if already google api loaded.
    addGoogleApiLoadHandler(() => {
      this.isGoogleApiLoaded = true;
      gapi.signin2.render(this.googleLoginWrapperId, {
        scope: 'profile email',
        width: 240,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: this.onGoogleLoginSuccess,
        onfailure: this.onGoogleLoginFailed,
      });
    });
  }
  public async signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    await auth2.signOut();
    this.isLoginFinished = false;
    this.isLoginSuccessful = false;
  }
  private onGoogleLoginSuccess(googleUser: gapi.auth2.GoogleUser) {
    console.log(googleUser);
    this.isLoginFinished = true;
    this.isLoginSuccessful = true;

    this.googleUser = googleUser;
  }

  private onGoogleLoginFailed({ error }: { error: string }) {
    this.isLoginFinished = true;
    this.isLoginSuccessful = false;

    this.googleLoginError = error;
  }
}

