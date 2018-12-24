import BaseOpenIdAuthenticationService from "./BaseOpenIdAuthenticationService";
import { IAuthResult } from "./BaseAuthenticationService";
import fetch from "node-fetch";
import { getConfiguration } from "@/configuration";

// TODO : Move app id to config
const FACEBOOK_APP_ID = '1981226042178093';
const { FACEBOOK_SECRET_KEY } = getConfiguration();

export default class FacebookAuthenticationService extends BaseOpenIdAuthenticationService {
  getOrigin(): string {
    return 'facebook';
  }
  async verifyIdToken(idToken: string): Promise<IAuthResult> {
    try {
      const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${idToken}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_SECRET_KEY}`);

      const json = await response.json();
      const { data, error } = json;
      if (error) {
        throw new Error(JSON.stringify(error, null, 2));
      }

      if (!data) {
        throw new Error(`no data from facebook debug_token response : ${JSON.stringify(data, null, 2)}`);
      }

      const {
        is_valid: isValid,
        user_id: userId,
      } = data;
      if (!isValid) {
        throw new error('not valid facebook access token');
      }

      return {
        identityId: this.generateIdentityId(userId),
      };
    } catch(err) {
      console.error(err);
      return null;
    }
  }
}
