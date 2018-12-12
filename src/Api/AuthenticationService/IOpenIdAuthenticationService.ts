import IAuthenticationService, { IAuthResult } from "./IAuthenticationService";

export interface ITokenVerificationResult extends IAuthResult {

}

export default interface IOpenIdAuthenticationService extends IAuthenticationService {
  verifyIdToken(idToken: string): Promise<ITokenVerificationResult>
}
