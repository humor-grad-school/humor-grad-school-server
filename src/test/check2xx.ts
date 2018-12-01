import { Response } from "node-fetch";

export default async function check2xx(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return;
  } else {
    const text = await response.text();
    throw new Error(text);
  }
}
