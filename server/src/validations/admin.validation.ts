import Joi from 'joi';
import { UserRoleEnum, TaskStatusEnum, TaskPriorityEnum, UserStatusEnum } from '../utils/enum.util';

export const getAllTasksForAdminValidation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid(...Object.values(TaskStatusEnum)).optional(),
    priority: Joi.string().valid(...Object.values(TaskPriorityEnum)).optional(),
    assignee: Joi.string().optional(),
    createdBy: Joi.string().optional(),
  }),
};

export const assignTaskToUserValidation = {
  params: Joi.object({
    taskId: Joi.string().required(),
  }),
  body: Joi.object({
    assigneeId: Joi.string().required(),
  }),
};

export const getAllUsersForAdminValidation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    role: Joi.string().valid(...Object.values(UserRoleEnum)).optional(),
    status: Joi.string().valid('active', 'blocked').optional(),
  }),
};

export const updateUserRoleAdminValidation = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    role: Joi.string()
      .valid(...Object.values(UserRoleEnum))
      .required(),
  }),
};

export const deleteUserAdminValidation = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

export const updateUserAdminValidation = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    username: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
    status: Joi.string().valid(...Object.values(UserStatusEnum)).optional(),
  }),
};

export const createUserAdminValidation = {
  body: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...Object.values(UserRoleEnum)).required(),
    status: Joi.string().valid(...Object.values(UserStatusEnum)).required(),
  }),
};
