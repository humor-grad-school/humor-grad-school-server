import IdentityModel from "@/Model/IdentityModel";
import BaseAuthenticationService, { IAuthResult } from "./BaseAuthenticationService";

export interface OpenIdAuthenticationRequestData {
  idToken: string;
}

export default abstract class BaseOpenIdAuthenticationService extends BaseAuthenticationService {
  abstract getOrigin(): string;
  async createIdentity(authResult: IAuthResult): Promise<IdentityModel> {
    return await IdentityModel.query().insertAndFetch({
      id: authResult.identityId,
      origin: this.getOrigin(),
    });
  }
  async getIdentity(identityId: string): Promise<IdentityModel> {
    const identity =  await IdentityModel.query().findById(identityId);
    return identity;
  }
  abstract verifyIdToken(idToken: string): Promise<IAuthResult>;
  async authenticateRequest(request: OpenIdAuthenticationRequestData): Promise<IAuthResult> {
    const { idToken } = request;
    const tokenVerificationResult = await this.verifyIdToken(idToken);
    return tokenVerificationResult;
  }
}
