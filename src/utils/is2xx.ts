import { Response } from "node-fetch";

export function is2xx(response: Response) {
  return response.status >= 200 && response.status < 300;
}