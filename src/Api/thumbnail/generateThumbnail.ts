import sharp from 'sharp';

export async function generateThumbnail(image: Buffer): Promise<Buffer> {
  return await sharp(image)
    .resize(120, 60)
    .jpeg({
      progressive: true,
    })
    .toBuffer();
}
