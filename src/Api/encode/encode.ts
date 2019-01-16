import fileType from 'file-type';
import encodeImage from './encodeImage';
import encodeVideo from './encodeVideo';
import { s3 } from '@/s3Helper';
import { getConfiguration } from '@/configuration';

export type MediaSize = { minWidth?: number, maxWidth?: number, minHeight?: number, maxHeight?: number };

/**
 * this function will save to s3://{destBucket}/{destBaseKey}.jpg or mp4
 */
export default async function encode(
  key: string,
  size: MediaSize,
  destBucket: string,
  destBaseKey: string,
): Promise<string> {
  const response = await s3.getObject({
    Bucket: getConfiguration().BEFORE_ENCODING_S3_BUCKET,
    Key: key,
  }).promise();

  const body = response.Body as Buffer;

  const { ext, mime } = fileType(body);

  if (['image', 'video'].every((type) => !mime.startsWith(type))) {
    throw new Error(`Cannot encode media ${mime}`);
  }

  const isResultImage = mime.startsWith('image/') && ext !== 'gif';

  const encodedMedia = isResultImage
    ? await encodeImage(body, size)
    : await encodeVideo(body, size);
  const encodedMediaMime = fileType(encodedMedia).mime;

  const destKey = `${destBaseKey}.${isResultImage ? 'jpg' : 'mp4'}`;

  await s3.putObject({
    Bucket: destBucket,
    Key: destKey,
    Body: encodedMedia,
    ContentType: encodedMediaMime,
  }).promise();

  return destKey;
}
