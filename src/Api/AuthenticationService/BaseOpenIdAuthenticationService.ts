import BaseAuthenticationService, { IAuthResult, RequestInformation } from "./BaseAuthenticationService";

export interface OpenIdAuthenticationRequestData {
  idToken: string;
}

export default abstract class BaseOpenIdAuthenticationService extends BaseAuthenticationService {
  abstract getOrigin(): string;

  abstract verifyIdToken(idToken: string): Promise<IAuthResult>;

  async authenticateRequest(request: OpenIdAuthenticationRequestData, requestInformation: RequestInformation): Promise<IAuthResult> {
    const { idToken } = request;
    const tokenVerificationResult = await this.verifyIdToken(idToken);
    return tokenVerificationResult;
  }
}
