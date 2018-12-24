import GoogleAuthenticationService from "./GoogleAuthenticationService";
import IAuthenticationService from "./BaseAuthenticationService";
import KakaoAuthenticationService from "./KakaoAuthenticationService";
import FacebookAuthenticationService from "./FacebookAuthenticationService";

const authenticationServices = [
  new GoogleAuthenticationService(),
  new KakaoAuthenticationService(),
  new FacebookAuthenticationService(),
];

const authenticationServiceMap = authenticationServices.reduce((prev, authenticationService) => {
  return {
    ...prev,
    [authenticationService.getOrigin()]: authenticationService,
  };
}, {});

export function getAuthenticationService(origin: string): IAuthenticationService {
  return authenticationServiceMap[origin];
}