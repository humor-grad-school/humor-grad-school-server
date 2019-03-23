import GoogleAuthenticationService from "./GoogleAuthenticationService";
import IAuthenticationService from "./BaseAuthenticationService";
import KakaoAuthenticationService from "./KakaoAuthenticationService";
import FacebookAuthenticationService from "./FacebookAuthenticationService";
import LocalAuthenticationService from "./LocalAuthenticationService";
import { isDevelopment } from "@/index";
import BaseAuthenticationService from "./BaseAuthenticationService";

const authenticationServices: BaseAuthenticationService[] = [
  new GoogleAuthenticationService(),
  new KakaoAuthenticationService(),
  new FacebookAuthenticationService(),
  ...(isDevelopment ? [new LocalAuthenticationService()] : []),
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
