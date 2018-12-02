import { validate } from 'class-validator';

export default function validateBody<T>(type: { new(): T; }) {
  return async (ctx, next) => {
    const body = Object.assign(new type, ctx.request.body);
    const validationErrors = await validate(body);
    if (validationErrors.length) {
      throw validationErrors[0];
    }
    return next();
  }
}