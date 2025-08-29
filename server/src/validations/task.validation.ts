import Joi from 'joi';
import { TaskStatusEnum, TaskPriorityEnum } from '../utils/enum.util';

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