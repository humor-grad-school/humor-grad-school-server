import { check2xx } from '@/test/test';

export default async function uploadWithPresignedUrl(
  url: string,
  fields: { [key: string]: string },
  key: string,
  file: File,
): Promise<string> {

  const formData = new FormData();
  // tslint:disable-next-line:no-shadowed-variable
  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value);
  });
  formData.set('key', key);
  formData.set('file', file);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  await check2xx(response);

  return key;
}
