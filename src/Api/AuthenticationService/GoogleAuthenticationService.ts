import { Request } from "koa";
import { OAuth2Client } from 'google-auth-library';
import IOpenIdAuthenticationService, { ITokenVerificationResult } from "./IOpenIdAuthenticationService";
import { LoginTicket } from "google-auth-library/build/src/auth/loginticket";
import IdentityModel from "@/Model/IdentityModel";
import BaseOpenIdAuthenticationService from "./BaseOpenIdAuthenticationService";

// TODO : Move google client id to config
const GOOGLE_CLIENT_ID = '74489406824-dlmplsl075187spamd9a4m6g90ah56so.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export default class GoogleAuthenticationService extends BaseOpenIdAuthenticationService {
  async verifyIdToken(idToken: string): Promise<ITokenVerificationResult> {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      return {
        sub: ticket.getUserId(),
      };
    } catch(err) {
      return null;
    }
  }
  async authenticateRequest(request: Request): Promise<ITokenVerificationResult> {
    const { idToken } = request.body;
    const tokenVerificationResult = await this.verifyIdToken(idToken);
    return tokenVerificationResult;
  }
}
