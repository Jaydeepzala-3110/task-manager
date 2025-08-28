import { NextFunction } from 'express';
import { validationFailResponse } from './response.util';

export function validate (schema: any) {
  return (req: any, res: any, next: NextFunction) => {
    let isValid = true;
    Object.keys(schema).forEach((key) => {
      // multiple error
      // schema[key].validate(req[key],{ abortEarly: false });
      let { error } = schema[`${key}`].validate(req[`${key}`], { abortEarly: false });
      if (error) {
        isValid = false;
        // if (Array.isArray(details) && details.length && details[0].message) {
        let errorObj: any = {};
        let messages: string = 'validation fail';
        error.details.map(({ message, context }: any) => {
          let msg = message.replace(/['"]/g, '');
          // messages += msg;
          let obj: any = {};
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
