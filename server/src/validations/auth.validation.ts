import * as Joi from 'joi';

const registerValidation = {
  body: Joi.object().keys({
    username: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one lowercase, one uppercase letter, and one number",
      }),
  }),
};

export default registerValidation;

export { registerValidation };