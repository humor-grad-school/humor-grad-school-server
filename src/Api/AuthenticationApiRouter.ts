import { BaseAuthenticationApiRouter, HgsRouterContext, Session } from "./types/generated/server/ServerBaseApiRouter";
import { ResponseType } from "./types/generated/ResponseType";
import { getAuthenticationService } from "./AuthenticationService";
import UserModel from "@/Model/UserModel";
import uuid from 'uuid/v4';
import sessionCacheService from "./Cache/sessionCacheService";
import { RequestInformation } from "./AuthenticationService/BaseAuthenticationService";
import { ErrorCode } from "./types/generated/ErrorCode";

async function issueSessionToken(user: UserModel): Promise<string> {
  const sessionToken = uuid();
  const session: Session = {
    userId: user.id,
  };
  await sessionCacheService.set(sessionToken, session);
  return sessionToken;
}

export default class AuthenticationApiRouter extends BaseAuthenticationApiRouter {
  protected async authenticate(
    context: HgsRouterContext,
    origin: string,
    authenticationRequestData: { idToken: string; },
  ): Promise<ResponseType.AuthenticateResponseType> {
    console.log(origin, authenticationRequestData);
    const authenticationService = getAuthenticationService(origin);

    if (!authenticationService) {
      console.warn('wrong identityType - ', origin);
      return {
        isSuccessful: false,
        errorCode: ErrorCode.AuthenticateErrorCode.WrongIdentityType,
      };
    }

    const requestInformation: RequestInformation = {
      ip: context.ip,
    };

    const authResult = await authenticationService.authenticateRequest(authenticationRequestData, requestInformation);

    if (!authResult) {
      console.warn('authentication failed'); // TODO : Add more Information
      return {
        isSuccessful: false,
        errorCode: ErrorCode.AuthenticateErrorCode.AuthenticationFailed,
      };
    }

    const identity = await authenticationService.getIdentity(authResult.identityId)
      || await authenticationService.createIdentity(authResult);

    const user = await identity.getUser();
    if (!user) {
      // TODO : Need sign in
      console.warn('No user with Identity. Need sign in');
      return {
        isSuccessful: false,
        errorCode: ErrorCode.AuthenticateErrorCode.NoUser,
      };
    }

    const sessionToken = await issueSessionToken(user);

    return {
      isSuccessful: true,
      data: {
        sessionToken
      },
    };
  }
}
