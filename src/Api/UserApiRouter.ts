import { HgsRouterContext, BaseUserApiRouter } from "./types/generated/server/ServerBaseApiRouter";
import { ResponseType } from "./types/generated/ResponseType";
import { getAuthenticationService } from "./AuthenticationService";
import { ErrorCode } from "./types/generated/ErrorCode";
import { transaction } from "objection";
import UserModel from "@/Model/UserModel";
import { getConfiguration } from "@/configuration";
import encode, { MediaSize } from "./encode/encode";
import { RequestInformation } from "./AuthenticationService/BaseAuthenticationService";

export default class UserApiRouter extends BaseUserApiRouter {
  protected async signUp(
    context: HgsRouterContext,
    username: string,
    origin: string,
    authenticationRequestData: { idToken: string; },
  ): Promise<ResponseType.SignUpResponseType> {

    const authenticationService = getAuthenticationService(origin);

    if (!authenticationService) {
      return {
        isSuccessful: false,
        errorCode: ErrorCode.SignUpErrorCode.WrongOrigin,
      };
    }

    const requestInformation: RequestInformation = {
      ip: context.ip,
    };

    const authResult = await authenticationService.authenticateRequest(authenticationRequestData, requestInformation);

    if (!authResult) {
      return {
        isSuccessful: false,
        errorCode: ErrorCode.SignUpErrorCode.AuthenticationFailed,
      };
    }

    const identity = await authenticationService.getIdentity(authResult.identityId);
    if (!identity) {
      return {
        isSuccessful: false,
        errorCode: ErrorCode.SignUpErrorCode.NoIdentity,
      };
    }

    try {
      await transaction(UserModel.knex(), async (trx) => {
        const user = await UserModel.query(trx).insert({
          username,
          avatarUrl: UserModel.defaultAvatarUrl,
        });
        await identity.$relatedQuery<UserModel>('user', trx).relate(user);
      });
    } catch(err) {
      return {
        isSuccessful: false,
        errorCode: ErrorCode.SignUpErrorCode.CreateUserFailed,
      };
    }

    return {
      isSuccessful: true,
    };
  }
  protected async updateAvatar(
    context: HgsRouterContext,
    key: string,
  ): Promise<ResponseType.UpdateAvatarResponseType> {
    const { userId } = context.session;

    const avatarSize: MediaSize = {
      minWidth: 120,
      maxWidth:120,
      minHeight: 60,
      maxHeight: 60,
    }
    const newAvatarS3Key = await encode(key, avatarSize, getConfiguration().AVATAR_S3_BUCKET, `${userId}-${key}`);

    await UserModel.query().update({
      avatarUrl: `${getConfiguration().avatarBaseUrl}/${newAvatarS3Key}`,
    }).where('id', userId);

    return {
      isSuccessful: true,
    };
  }
}
