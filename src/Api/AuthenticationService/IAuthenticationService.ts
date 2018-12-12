import { Request } from "koa";
import IdentityModel from "@/Model/IdentityModel";

export interface IAuthResult {

}

export default interface IAuthenticationService {
  authenticateRequest(request: Request): Promise<IAuthResult>;
  getIdentity(authResult: IAuthResult): Promise<IdentityModel>;
}
