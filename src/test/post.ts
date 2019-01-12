import fetch, { Response } from 'node-fetch';
import fs, { ReadStream } from 'fs';
import check2xx from './check2xx';
import { getConfiguration } from '@/configuration';

const FormData = require('form-data');

const serverUrl = 'http://localhost:8080';

enum ContentType {
  CONTENT = 'content',
  MEDIA = 'media',
};

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

async function uploadWithPreSignedUrl(content: string | ReadStream, type: ContentType): Promise<string> {
  const {
    url,
    fields,
    key,
  } = await getPreSignedUrl(type);

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('key', key);
  formData.append('file', content);

  await (new Promise((resolve, reject) => {
    formData.submit(url.replace('https', 'http'), (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  }));

  return key;
}

async function uploadMedia(media: ReadStream): Promise<string> {
  const key = await uploadWithPreSignedUrl(media, ContentType.MEDIA);
  await requestEncodingMedia(key);
  return key;
}

async function fetchBlob(url) {
  const response = await fetch(url);
  await check2xx(response);
  return await response.blob();
}

async function fetchJson(url) {
  const response = await fetch(url);
  await check2xx(response);
  return await response.json();
}

async function fetchText(url) {
  const response = await fetch(url);
  await check2xx(response);
  return await response.text();
}

export default async function postTest() {
  const mediaFiles: ReadStream[] = [
    fs.createReadStream('./testImage/jpg.jpg'),
    fs.createReadStream('./testImage/gif.gif'),
  ];
  const contentJson: string = 'test123';

  const keys = await Promise.all(mediaFiles.map(async media => {
    return await uploadMedia(media);
  }));
  console.log('media keys: ', keys);
  const contentKey = await uploadWithPreSignedUrl(contentJson, ContentType.CONTENT);

  const encodedMedias = await Promise.all(keys.map(async key => {
    return await fetchBlob(`http://127.0.0.1:9000/${getConfiguration().AFTER_ENCODING_S3_BUCKET}/${key}`);
  }));

  console.log('encodedMedias', encodedMedias);

  const savedContent = await fetchText(`http://127.0.0.1:9000/${getConfiguration().CONTENT_S3_BUCKET}/${contentKey}`);
  console.log('savedContent', savedContent);

  return 'SEX'
}