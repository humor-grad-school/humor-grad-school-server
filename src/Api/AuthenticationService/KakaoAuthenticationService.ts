import BaseOpenIdAuthenticationService from "./BaseOpenIdAuthenticationService";
import { IAuthResult } from "./BaseAuthenticationService";
import fetch from "node-fetch";
import { is2xx } from "@/utils/is2xx";

// TODO : move this to config
const kakaoMapId = 256258;

// Actually, Kakao is OAuth 2.0 but their sdk provide that like openId. FUCK
export default class KakaoAuthenticationService extends BaseOpenIdAuthenticationService {
  getOrigin(): string {
    return 'kakao';
  }
  async verifyIdToken(idToken: string): Promise<IAuthResult> {
    // REBEMBER, KAKAO IS ACTUALLY OAUTH 2.0
    try {
      const response = await fetch('https://kapi.kakao.com/v1/user/access_token_info', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!is2xx(response)) {
        return;
      }

      const body = await response.json();

      if (body.appId !== kakaoMapId) {
        console.warn('someone try hacking with wrong kakao method');
        return;
      }

      return {
        identityId: this.generateIdentityId(body.id),
      };

    } catch(err) {
      return null;
    }
  }
}
