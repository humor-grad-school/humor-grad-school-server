import BaseAuthenticationService, { IAuthResult, RequestInformation, AuthenticationRequestData } from "./BaseAuthenticationService";

export default class LocalAuthenticationService extends BaseAuthenticationService {
  getOrigin(): string {
    return 'local';
  }

  async authenticateRequest(requestData: AuthenticationRequestData, requestInformation: RequestInformation): Promise<IAuthResult> {
    const { ip } = requestInformation;
    console.log(ip);
    const isLocalOrLoopbackRequest = ['localhost', '127.0.0.1', '::ffff:127.0.0.1', '::1', '127.0.0.0', '255.255.255.0'].includes(ip);
    if (!isLocalOrLoopbackRequest) {
      return null;
    }

    return {
      identityId: requestData.idToken,
    };
  }
}
