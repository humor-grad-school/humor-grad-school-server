const serverUrl = 'http://localhost:8080';

enum ContentType {
  CONTENT = 'content',
  MEDIA = 'media',
};

export async function check2xx(response: Response) {
  if (response.status >= 200 || response.status < 300) {
    return;
  } else {
    const json = await response.json();
    throw new Error(json);
  }
}

export interface GetPreSignedUrlResponse {
  url: string;
  fields: { [key: string]: string };
  key: string;
}

async function getPreSignedUrl(type: ContentType): Promise<GetPreSignedUrlResponse> {
  const response = await fetch(`${serverUrl}/post/preSignedUrl?type=${type}`);
  await check2xx(response);
  return response.json();
}

async function requestEncodingMedia(key: string) {
  const response = await fetch(`${serverUrl}/post/encode/${key}`, {
    method: 'POST',
  });
  await check2xx(response);
}

async function uploadWithPreSignedUrl(content: string | File, type: ContentType): Promise<string> {
  const {
    url,
    fields,
    key,
  } = await getPreSignedUrl(type);

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value);
  });
  formData.set('key', key);
  formData.set('file', content);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  await check2xx(response);

  return key;
}

async function uploadMedia(media: File) {
  const key = await uploadWithPreSignedUrl(media, ContentType.MEDIA);
  await requestEncodingMedia(key);
}


async function whatSmithooToDoForUploadingPost() {
  const mediaFiles: File[] = [];
  const contentJson: string = '';

  await Promise.all(mediaFiles.map(async media => {
    await uploadMedia(media);
  }));

  await uploadWithPreSignedUrl(contentJson, ContentType.CONTENT);

  return 'SEX'
}