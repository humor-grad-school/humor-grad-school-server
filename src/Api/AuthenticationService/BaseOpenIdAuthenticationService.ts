import { Request } from "koa";
import IdentityModel from "@/Model/IdentityModel";
import IOpenIdAuthenticationService, { ITokenVerificationResult } from "./IOpenIdAuthenticationService";

export interface OpenIdAuthenticationRequestData {
  idToken: string;
}

export default abstract class BaseOpenIdAuthenticationService implements IOpenIdAuthenticationService {
  abstract getOrigin(): string;
  async createIdentity(authResult: ITokenVerificationResult): Promise<IdentityModel> {
    return await IdentityModel.query().insertAndFetch({
      id: authResult.sub,
      origin: this.getOrigin(),
    });
  }
  async getIdentity(identityId: string): Promise<IdentityModel> {
    const identity =  await IdentityModel.query().findById(identityId);
    return identity;
  }
  abstract verifyIdToken(idToken: string): Promise<ITokenVerificationResult>;
  async authenticateRequest(request: OpenIdAuthenticationRequestData): Promise<ITokenVerificationResult> {
    const { idToken } = request;
    const tokenVerificationResult = await this.verifyIdToken(idToken);
    return tokenVerificationResult;
  }
}
