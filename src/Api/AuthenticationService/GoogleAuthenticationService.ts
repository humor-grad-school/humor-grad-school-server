import { Request } from "koa";
import { OAuth2Client } from 'google-auth-library';
import IOpenIdAuthenticationService, { ITokenVerificationResult } from "./IOpenIdAuthenticationService";
import { LoginTicket } from "google-auth-library/build/src/auth/loginticket";
import IdentityModel from "@/Model/IdentityModel";

// TODO : Move google client id to config
const GOOGLE_CLIENT_ID = '74489406824-dlmplsl075187spamd9a4m6g90ah56so';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

interface GoogleTokenVerificationResult extends ITokenVerificationResult {
  ticket: LoginTicket;
}

export default class GoogleAuthenticationService implements IOpenIdAuthenticationService {
  getIdentity(identity: string): Promise<IdentityModel> {
    throw new Error("Method not implemented.");
  }
  async verifyIdToken(idToken: string): Promise<GoogleTokenVerificationResult> {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      return {
        ticket,
      };
    } catch(err) {
      return null;
    }
  }
  async authenticateRequest(request: Request): Promise<GoogleTokenVerificationResult> {
    const { idToken } = request.body;
    const tokenVerificationResult = await this.verifyIdToken(idToken);
    return tokenVerificationResult;
  }
}
