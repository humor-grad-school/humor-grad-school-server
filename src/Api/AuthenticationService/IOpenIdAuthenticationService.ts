import IAuthenticationService, { IAuthResult } from "./IAuthenticationService";

export interface ITokenVerificationResult extends IAuthResult {
  sub: string;
}

export default interface IOpenIdAuthenticationService extends IAuthenticationService {
  verifyIdToken(idToken: string): Promise<ITokenVerificationResult>
}
