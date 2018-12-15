import { Request } from "koa";
import { OAuth2Client } from 'google-auth-library';
import { ITokenVerificationResult } from "./IOpenIdAuthenticationService";
import BaseOpenIdAuthenticationService from "./BaseOpenIdAuthenticationService";

// TODO : Move google client id to config
const GOOGLE_CLIENT_ID = '74489406824-dlmplsl075187spamd9a4m6g90ah56so.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export default class GoogleAuthenticationService extends BaseOpenIdAuthenticationService {
  getOrigin(): string {
    return 'google';
  }
  async verifyIdToken(idToken: string): Promise<ITokenVerificationResult> {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const userId = ticket.getUserId();
      return {
        sub: userId,
        identityId: userId,
      };
    } catch(err) {
      return null;
    }
  }
}
