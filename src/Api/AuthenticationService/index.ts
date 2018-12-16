import GoogleAuthenticationService from "./GoogleAuthenticationService";
import IAuthenticationService from "./BaseAuthenticationService";
import KakaoAuthenticationService from "./KakaoAuthenticationService";

const authenticationServices = [
  new GoogleAuthenticationService(),
  new KakaoAuthenticationService(),
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