import { NextFunction } from 'express';
import { validationFailResponse } from './response.util';

export function validate(schema: any) {
  return (req: any, res: any, next: NextFunction) => {
    let isValid = true;
    Object.keys(schema).forEach((key) => {
      // multiple error
      // schema[key].validate(req[key],{ abortEarly: false });
      const { error } = schema[`${key}`].validate(req[`${key}`], { abortEarly: false });
      if (error) {
        isValid = false;
        // if (Array.isArray(details) && details.length && details[0].message) {
        const errorObj: any = {};
        const messages: string = 'validation fail';
        error.details.map(({ message, context }: any) => {
          const msg = message.replace(/['"]/g, '');
          // messages += msg;
          const obj: any = {};
          if (context && context.key) errorObj[context.key] = msg;
          return obj;
        });
        return validationFailResponse(res, messages, errorObj);
      }
    });
    if (isValid) {
      return next();
    }
  };
}
