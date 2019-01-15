import { RequestBodyType } from '../RequestBodyType';
import { ParamMap } from '../ParamMap';
import { ResponseType, ResponseDataType } from '../ResponseType';

let sessionToken: string;
let baseServerUrl: string;

class HgsRestApiResponse<T extends ResponseType.BaseResponseType, R> {
  constructor(readonly rawResponse: T) {
  }
  get isSuccessful() {
    return this.rawResponse.isSuccessful;
  }
  get data(): R {
    if (!this.rawResponse.isSuccessful) {
      throw new Error('it must be successful to get data');
    }
    if (!this.rawResponse.data) {
      throw new Error('data is empty, not possible error');
    }
    return this.rawResponse.data as R;
  }
  get errorCode() {
    return this.rawResponse.errorCode;
  }
}

export namespace HgsRestApi {
    export function setSessionToken(newSessionToken: string) {
       sessionToken = newSessionToken;
    }
    export function setBaseServerUrl(newBaseServerUrl: string) {
        baseServerUrl = newBaseServerUrl;
    }
    export function is2xx(response: Response): boolean {
      return response.status >= 200 && response.status < 300;
    }


    export async function authenticate(
        params: ParamMap.AuthenticateParamMap,
        body: RequestBodyType.AuthenticateRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.AuthenticateResponseType, ResponseDataType.AuthenticateResponseDataType>> {
        const url = `${baseServerUrl}/auth/${params.origin}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }

    export async function signUp(
        params: ParamMap.SignUpParamMap,
        body: RequestBodyType.SignUpRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.SignUpResponseType, ResponseDataType.SignUpResponseDataType>> {
        const url = `${baseServerUrl}/user`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }
    export async function requestPresignedPostFieldsForAvatar(
        params: ParamMap.RequestPresignedPostFieldsForAvatarParamMap,
        body: RequestBodyType.RequestPresignedPostFieldsForAvatarRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.RequestPresignedPostFieldsForAvatarResponseType, ResponseDataType.RequestPresignedPostFieldsForAvatarResponseDataType>> {
        const url = `${baseServerUrl}/user/avatar/presignedPost`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }
    export async function updateAvatar(
        params: ParamMap.UpdateAvatarParamMap,
        body: RequestBodyType.UpdateAvatarRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.UpdateAvatarResponseType, ResponseDataType.UpdateAvatarResponseDataType>> {
        const url = `${baseServerUrl}/user/avatar`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }

    export async function writePost(
        params: ParamMap.WritePostParamMap,
        body: RequestBodyType.WritePostRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.WritePostResponseType, ResponseDataType.WritePostResponseDataType>> {
        const url = `${baseServerUrl}/post`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }
    export async function encodeMedia(
        params: ParamMap.EncodeMediaParamMap,
        body: RequestBodyType.EncodeMediaRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.EncodeMediaResponseType, ResponseDataType.EncodeMediaResponseDataType>> {
        const url = `${baseServerUrl}/post/encode/${params.s3Key}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }
    export async function likePost(
        params: ParamMap.LikePostParamMap,
        body: RequestBodyType.LikePostRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.LikePostResponseType, ResponseDataType.LikePostResponseDataType>> {
        const url = `${baseServerUrl}/post/${params.postId}/like`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }

    export async function createBoard(
        params: ParamMap.CreateBoardParamMap,
        body: RequestBodyType.CreateBoardRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.CreateBoardResponseType, ResponseDataType.CreateBoardResponseDataType>> {
        const url = `${baseServerUrl}/board/${params.boardName}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }

    export async function writeComment(
        params: ParamMap.WriteCommentParamMap,
        body: RequestBodyType.WriteCommentRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.WriteCommentResponseType, ResponseDataType.WriteCommentResponseDataType>> {
        const url = `${baseServerUrl}/comment`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }
    export async function likeComment(
        params: ParamMap.LikeCommentParamMap,
        body: RequestBodyType.LikeCommentRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.LikeCommentResponseType, ResponseDataType.LikeCommentResponseDataType>> {
        const url = `${baseServerUrl}/comment/${params.commentId}/like`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }
    export async function writeSubComment(
        params: ParamMap.WriteSubCommentParamMap,
        body: RequestBodyType.WriteSubCommentRequestBodyType,
    ): Promise<HgsRestApiResponse<ResponseType.WriteSubCommentResponseType, ResponseDataType.WriteSubCommentResponseDataType>> {
        const url = `${baseServerUrl}/comment/${params.parentCommentId}`;
        const response = await fetch(url, {
            method: 'POSt',
            headers: {
                'content-type': 'application/json',
                ...(sessionToken
                  ? { Authorization: `sessionToken ${sessionToken}` }
                  : {}
                )
            },
            body: JSON.stringify(body),
        });

        if (!is2xx(response)) {
            throw new Error(response.status.toString());
        }
        return new HgsRestApiResponse(await response.json());
    }
}
