import { Request } from "koa";
import IdentityModel from "@/Model/IdentityModel";
import { OpenIdAuthenticationRequestData } from "./BaseOpenIdAuthenticationService";

export interface IAuthResult {
  identityId: string;
}

export type AuthenticationRequestData = OpenIdAuthenticationRequestData; // | OtherRequestData;

export default interface IAuthenticationService {
  getOrigin(): string;
  authenticateRequest(request: AuthenticationRequestData): Promise<IAuthResult>;
  getIdentity(identityId: string): Promise<IdentityModel>;
  createIdentity(authResult: IAuthResult): Promise<IdentityModel>;
}
