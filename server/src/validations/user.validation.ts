import Joi from 'joi';
import { UserRoleEnum, UserStatusEnum } from '../utils/enum.util';

export const listUsersValidation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    username: Joi.string().min(1).max(50).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid(...Object.values(UserRoleEnum)).optional(),
    status: Joi.string()
    .valid(...Object.values(UserStatusEnum))
    .optional(),
  }),
};

export const updateUserRoleValidation = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    role: Joi.string()
      .valid(...Object.values(UserRoleEnum))
      .required(),
  }),
};


