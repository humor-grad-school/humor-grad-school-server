import { RequestBodyType } from '../RequestBodyType';
import { ResponseType, ResponseDataType } from '../ResponseType';

let sessionToken: string;
let baseServerUrl: string;
let isDevelopment: boolean;

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
    export function setIsDevelopment(yesOrNo: boolean) {
      isDevelopment = yesOrNo;
    }


  export async function authenticate(
    body: RequestBodyType.AuthenticateRequestBodyType,
  ): Promise<HgsRestApiResponse<ResponseType.AuthenticateResponseType, ResponseDataType.AuthenticateResponseDataType>> {
    const url = `${baseServerUrl}/authentication/authenticate`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return new HgsRestApiResponse(await response.json());
  }

  export async function signUp(
    body: RequestBodyType.SignUpRequestBodyType,
  ): Promise<ResponseType.SignUpResponseType> {
    const url = `${baseServerUrl}/user/signUp`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return await response.json();
  }
  export async function updateAvatar(
    body: RequestBodyType.UpdateAvatarRequestBodyType,
  ): Promise<ResponseType.UpdateAvatarResponseType> {
    const url = `${baseServerUrl}/user/updateAvatar`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return await response.json();
  }

  export async function writePost(
    body: RequestBodyType.WritePostRequestBodyType,
  ): Promise<HgsRestApiResponse<ResponseType.WritePostResponseType, ResponseDataType.WritePostResponseDataType>> {
    const url = `${baseServerUrl}/post/writePost`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return new HgsRestApiResponse(await response.json());
  }
  export async function encodeMedia(
    body: RequestBodyType.EncodeMediaRequestBodyType,
  ): Promise<ResponseType.EncodeMediaResponseType> {
    const url = `${baseServerUrl}/post/encodeMedia`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return await response.json();
  }
  export async function likePost(
    body: RequestBodyType.LikePostRequestBodyType,
  ): Promise<ResponseType.LikePostResponseType> {
    const url = `${baseServerUrl}/post/likePost`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return await response.json();
  }
  export async function requestPresignedPostFieldsForContent(): Promise<HgsRestApiResponse<ResponseType.RequestPresignedPostFieldsForContentResponseType, ResponseDataType.RequestPresignedPostFieldsForContentResponseDataType>> {
    const url = `${baseServerUrl}/post/requestPresignedPostFieldsForContent`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return new HgsRestApiResponse(await response.json());
  }

  export async function createBoard(
    body: RequestBodyType.CreateBoardRequestBodyType,
  ): Promise<ResponseType.CreateBoardResponseType> {
    const url = `${baseServerUrl}/board/createBoard`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return await response.json();
  }

  export async function writeComment(
    body: RequestBodyType.WriteCommentRequestBodyType,
  ): Promise<HgsRestApiResponse<ResponseType.WriteCommentResponseType, ResponseDataType.WriteCommentResponseDataType>> {
    const url = `${baseServerUrl}/comment/writeComment`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return new HgsRestApiResponse(await response.json());
  }
  export async function likeComment(
    body: RequestBodyType.LikeCommentRequestBodyType,
  ): Promise<ResponseType.LikeCommentResponseType> {
    const url = `${baseServerUrl}/comment/likeComment`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return await response.json();
  }
  export async function writeSubComment(
    body: RequestBodyType.WriteSubCommentRequestBodyType,
  ): Promise<HgsRestApiResponse<ResponseType.WriteSubCommentResponseType, ResponseDataType.WriteSubCommentResponseDataType>> {
    const url = `${baseServerUrl}/comment/writeSubComment`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return new HgsRestApiResponse(await response.json());
  }

  export async function increaseViewCount(
    body: RequestBodyType.IncreaseViewCountRequestBodyType,
  ): Promise<ResponseType.IncreaseViewCountResponseType> {
    const url = isDevelopment
      ? 'https://viewcount.humorgrad.com/viewCount/increaseViewCount'
      : `${baseServerUrl}/viewCount/increaseViewCount`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
      body: JSON.stringify(body),
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return await response.json();
  }

  export async function requestPresignedPostFieldsForMedia(): Promise<HgsRestApiResponse<ResponseType.RequestPresignedPostFieldsForMediaResponseType, ResponseDataType.RequestPresignedPostFieldsForMediaResponseDataType>> {
    const url = `${baseServerUrl}/media/requestPresignedPostFieldsForMedia`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? { Authorization: `sessionToken ${sessionToken}` }
          : {}
        ),
      },
    });

    if (!is2xx(response)) {
      throw new Error(response.status.toString());
    }
    return new HgsRestApiResponse(await response.json());
  }
}
