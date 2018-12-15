import GoogleAuthenticationService from "./GoogleAuthenticationService";
import IAuthenticationService from "./IAuthenticationService";

const authenticationServices = [
  new GoogleAuthenticationService(),
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