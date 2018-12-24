import { OAuth2Client } from 'google-auth-library';
import BaseOpenIdAuthenticationService from "./BaseOpenIdAuthenticationService";
import { IAuthResult } from "./BaseAuthenticationService";

// TODO : Move google client id to config
const GOOGLE_CLIENT_ID = '74489406824-dlmplsl075187spamd9a4m6g90ah56so.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export default class GoogleAuthenticationService extends BaseOpenIdAuthenticationService {
  getOrigin(): string {
    return 'google';
  }
  async verifyIdToken(idToken: string): Promise<IAuthResult> {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const userId = ticket.getUserId();
      return {
        identityId: this.generateIdentityId(userId),
      };
    } catch(err) {
      return null;
    }
  }
}
