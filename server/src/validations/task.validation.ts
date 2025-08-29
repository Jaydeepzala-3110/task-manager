import Joi from 'joi';
import { TaskStatusEnum, TaskPriorityEnum } from '../utils/enum.util';

export const listTaskValidation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    status: Joi.string().valid(...Object.values(TaskStatusEnum)).optional(),
    priority: Joi.string().valid(...Object.values(TaskPriorityEnum)).optional(),
    assignee: Joi.string().optional(),
    tags: Joi.string().optional(),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'dueDate', 'priority', 'status').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    dueDateFrom: Joi.date().iso().optional(),
    dueDateTo: Joi.date().iso().optional(),
  }),
};

export const createTaskValidation = {
  body: Joi.object({
    title: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(1000).optional(),
    status: Joi.string()
      .valid(...Object.values(TaskStatusEnum))
      .optional(),
    priority: Joi.string()
      .valid(...Object.values(TaskPriorityEnum))
      .optional(),
    dueDate: Joi.date().iso().optional(),
    tags: Joi.array().items(Joi.string().max(10)).max(10).optional(),
  }),
};

export const updateTaskValidation = {
  body: Joi.object({
    title: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(1000).optional(),
    status: Joi.string()
      .valid(...Object.values(TaskStatusEnum))
      .optional(),
    priority: Joi.string()
      .valid(...Object.values(TaskPriorityEnum))
      .optional(),
    dueDate: Joi.date().iso().optional(),
    tags: Joi.array().items(Joi.string().max(10)).max(10).optional(),
  }),
};

export const deleteTaskValidation = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};
