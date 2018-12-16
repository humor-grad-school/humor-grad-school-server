import IdentityModel from "@/Model/IdentityModel";
import { OpenIdAuthenticationRequestData } from "./BaseOpenIdAuthenticationService";

export interface IAuthResult {
  identityId: string;
}

export type AuthenticationRequestData = OpenIdAuthenticationRequestData; // | OtherRequestData;

export default abstract class BaseAuthenticationService {
  protected generateIdentityId(originId) {
    return `${this.getOrigin()}-${originId}`;
  }
  abstract getOrigin(): string;
  abstract authenticateRequest(requestData: AuthenticationRequestData): Promise<IAuthResult>;
  abstract getIdentity(identityId: string): Promise<IdentityModel>;
  abstract createIdentity(authResult: IAuthResult): Promise<IdentityModel>;
}
