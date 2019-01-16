import sharp from 'sharp';
import { MediaSize } from './encode';

export default async function encodeImage(buffer: Buffer, size: MediaSize) {
  let image = sharp(buffer);

  const { width, height } = await image.metadata();

  let destWidth = width;
  if (size.minWidth && destWidth < size.minWidth) {
    destWidth = size.minWidth;
  }
  if (size.maxWidth && destWidth > size.maxWidth) {
    destWidth = size.maxWidth;
  }

  let destHeight = height;
  if (!size.minHeight && !size.maxHeight) {
    destHeight = undefined;
  } else {
    if (destHeight < size.minHeight) {
      destHeight = size.minHeight;
    }
    if (destHeight > size.maxHeight) {
      destHeight = size.maxHeight;
    }
  }

  image = image.resize(destWidth, destHeight);

  const jpegBuffer = await image
    .jpeg({
      progressive: true,
    })
    .toBuffer();

  return jpegBuffer;
}
