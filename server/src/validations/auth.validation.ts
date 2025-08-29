import * as Joi from 'joi';
import { UserRoleEnum } from '../utils/enum.util';

const registerValidation = {
  body: Joi.object().keys({
    username: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    role: Joi.string()
      .valid(...Object.values(UserRoleEnum))
      .optional(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one lowercase, one uppercase letter, and one number',
      }),
  }),
};

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export { registerValidation, loginValidation };
