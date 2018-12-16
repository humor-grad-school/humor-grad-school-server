// import { Component, Vue } from 'vue-property-decorator';
// import { getGoogleApiLoaded, addGoogleApiLoadHandler } from './googleApiLoadingChecker';
// import { ErrorCode } from '../../../src/Api/ErrorCode';

// import KakaoLoginComponent from './Kakao/KakaoLoginComponent.vue';

// export function is2xx(response: Response) {
//   return response.status >= 200 && response.status < 300;
// }

// @Component({
//   components: {
//     KakaoLoginComponent,
//   },
// })
// export default class App extends Vue {
//   public isGoogleApiLoaded = getGoogleApiLoaded();
//   public googleLoginWrapperId = 'google-button';
//   public isLoginFinished: boolean = false;
//   public isLoginSuccessful: boolean = false;
//   public googleUser?: gapi.auth2.GoogleUser;
//   public googleLoginError?: string;
//   public isNeedSignUp: boolean = false;
//   public username?: string = '';
//   public idToken?: string;

//   public mounted() {
//     // YOU MUST USE BELOW CODE IN MOUNTED. Because it need HTML DOM with id googleLoginWrapperId.
//     // addGoogleApiLoadHandler call callback function immediately if already google api loaded.
//     addGoogleApiLoadHandler(() => {
//       this.isGoogleApiLoaded = true;
//       gapi.signin2.render(this.googleLoginWrapperId, {
//         scope: 'profile email',
//         width: 240,
//         height: 50,
//         longtitle: true,
//         theme: 'dark',
//         onsuccess: this.onGoogleLoginSuccess,
//         onfailure: this.onGoogleLoginFailed,
//       });
//     });
//   }
//   public async signOut() {
//     const auth2 = gapi.auth2.getAuthInstance();
//     await auth2.signOut();
//     this.isLoginFinished = false;
//     this.isLoginSuccessful = false;
//   }

//   public async signUp() {
//     const response = await fetch('http://localhost:8080/user', {
//       method: 'POST',
//       headers: {
//         'content-type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: this.username,
//         origin: 'google',
//         authenticationRequestData: {
//           idToken: this.idToken,
//         },
//       }),
//     });

//     if (is2xx(response)) {
//       this.isNeedSignUp = false;
//       return;
//     }

//     const body = await response.json();

//     // TODO : Error Handling
//     alert(`Failed for sign up : ${JSON.stringify(body, null, 2)}`);
//   }

//   private onGoogleLoginSuccess(googleUser: gapi.auth2.GoogleUser) {
//     console.log(googleUser);
//     this.isLoginFinished = true;
//     this.isLoginSuccessful = true;

//     this.googleUser = googleUser;
//     this.idToken = this.googleUser.getAuthResponse().id_token;

//     // Procedure : Google login => Send Google Id Token to Humor Server -> OK

//     this.loginToHumorWithGoogle();
//   }

//   private onGoogleLoginFailed({ error }: { error: string }) {
//     this.isLoginFinished = true;
//     this.isLoginSuccessful = false;

//     this.googleLoginError = error;
//   }

//   private async loginToHumorWithGoogle() {
//     const response = await fetch('http://localhost:8080/auth/google', {
//       method: 'POST',
//       headers: {
//         'content-type': 'application/json',
//       },
//       body: JSON.stringify({
//         authenticationRequestData: {
//           idToken: this.idToken,
//         },
//       }),
//     });

//     if (is2xx(response)) {
//       const { sessionToken } = await response.json();
//       console.log('session token : ', sessionToken);
//       return;
//     }

//     const { errorCode }: {
//       errorCode: ErrorCode.AuthenticateErrorCode,
//     } = await response.json();

//     switch (errorCode) {
//       case ErrorCode.AuthenticateErrorCode.NoUser: {
//         // need to sign up
//         this.isNeedSignUp = true;
//         break;
//       }
//       case ErrorCode.AuthenticateErrorCode.AuthenticationFailed: {
//         alert('Authentication Failed. Try Again!');
//         break;
//       }
//       default: {
//         // internal error
//         alert('Internal Error. Try Again!');
//         console.warn(errorCode);
//         break;
//       }
//     }
//   }
// }
