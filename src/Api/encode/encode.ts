import fileType from 'file-type';
import encodeImage from './encodeImage';
import encodeVideo from './encodeVideo';
import { s3 } from '@/s3Helper';
import { getConfiguration } from '@/configuration';

/**
 * this function will save to s3://{destBucket}/{destBaseKey}.png or mp4
 */
export default async function encode(key: string, destBucket: string, destBaseKey: string): Promise<string> {
  const { Body: body } = await s3.getObject({
    Bucket: getConfiguration().BEFORE_ENCODING_S3_BUCKET,
    Key: key,
  }).promise();
  const { ext, mime } = fileType(body);

  if (['image', 'video'].every((type) => !mime.startsWith(type))) {
    throw new Error(`Cannot encode media ${mime}`);
  }

  const isResultImage = mime.startsWith('image/') && ext !== 'gif';

  const encodedMedia = isResultImage
    ? await encodeImage(body)
    : await encodeVideo(body);
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
