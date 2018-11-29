import { validate } from 'class-validator';

export default function validateBody<T>(type: { new(): T; }) {
  return async (req, res, next) => {
    const body = Object.assign(new type, req.body);
    const validationErrors = await validate(body);
    if (validationErrors.length) {
      next(validationErrors[0]);
      return;
    }
    return next();
  }
}