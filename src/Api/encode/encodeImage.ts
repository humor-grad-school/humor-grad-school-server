import sharp from 'sharp';

const MAX_WIDTH = 300;

export default async function encodeImage(buffer) {
  let image = sharp(buffer);

  const { width } = await image.metadata();

  if (width <= MAX_WIDTH) {
    image = image.resize(MAX_WIDTH);
  }

  const jpegBuffer = await image
    .jpeg({
      progressive: true,
    })
    .toBuffer();

  return jpegBuffer;
}
