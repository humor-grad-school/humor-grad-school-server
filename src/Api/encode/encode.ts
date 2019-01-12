import fileType from 'file-type';
import encodeImage from './encodeImage';
import encodeVideo from './encodeVideo';
import { s3 } from '@/s3Helper';
import { getConfiguration } from '@/configuration';

export default async function encode(key: string) {
  const { Body: body } = await s3.getObject({
    Bucket: getConfiguration().BEFORE_ENCODING_S3_BUCKET,
    Key: key,
  }).promise();

  const { ext, mime } = fileType(body);

  if (['image', 'video'].every((type) => !mime.startsWith(type))) {
    throw new Error(`Cannot encode media ${mime}`);
  }

  const encodedMedia = mime.startsWith('image/') && ext !== 'gif'
    ? await encodeImage(body)
    : await encodeVideo(body);
  const encodedMediaMime = fileType(encodedMedia).mime;

  await s3.putObject({
    Bucket: getConfiguration().AFTER_ENCODING_S3_BUCKET,
    Key: key,
    Body: encodedMedia,
    ContentType: encodedMediaMime,
  }).promise();
}
