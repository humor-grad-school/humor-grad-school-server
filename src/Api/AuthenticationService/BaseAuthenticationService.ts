import IdentityModel from "@/Model/IdentityModel";
import { OpenIdAuthenticationRequestData } from "./BaseOpenIdAuthenticationService";

export interface IAuthResult {
  identityId: string;
}

export type AuthenticationRequestData = OpenIdAuthenticationRequestData; // | OtherRequestData;


export interface RequestInformation {
  ip: string;
}

export default abstract class BaseAuthenticationService {
  protected generateIdentityId(originId) {
    return `${this.getOrigin()}-${originId}`;
  }

  abstract getOrigin(): string;

  abstract authenticateRequest(requestData: AuthenticationRequestData, requestInformation: RequestInformation): Promise<IAuthResult>;

  public async getIdentity(identityId: string): Promise<IdentityModel> {
    const identity =  await IdentityModel.query().findById(identityId);
    return identity;
  }

  public async createIdentity(authResult: IAuthResult): Promise<IdentityModel> {
    return await IdentityModel.query().insertAndFetch({
      id: authResult.identityId,
      origin: this.getOrigin(),
    });
  }
}
