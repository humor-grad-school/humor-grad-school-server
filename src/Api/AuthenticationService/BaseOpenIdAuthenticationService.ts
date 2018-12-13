import { Request } from "koa";
import IdentityModel from "@/Model/IdentityModel";
import IOpenIdAuthenticationService, { ITokenVerificationResult } from "./IOpenIdAuthenticationService";

export default abstract class BaseOpenIdAuthenticationService implements IOpenIdAuthenticationService {
  async getIdentity(authResult: ITokenVerificationResult): Promise<IdentityModel> {
    const { sub: userId } = authResult;
    const identity =  await IdentityModel.query().findById(userId);
    return identity;
  }
  abstract verifyIdToken(idToken: string): Promise<ITokenVerificationResult>;
  abstract authenticateRequest(request: Request): Promise<ITokenVerificationResult>;
}
