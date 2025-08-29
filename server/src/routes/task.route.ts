import { Router } from 'express';
import { createTask, updateTask } from '../controller/task.controller';
import { validate } from '../utils/validation.util';
import { createTaskValidation, updateTaskValidation } from '../validations/task.validation';
import { auth } from '../middlewares/auth.middleware';
import { UserRoleEnum } from '../utils/enum.util';

const router = Router();

router.post(
  '/create',
  auth([UserRoleEnum.MEMBER]),
  validate(createTaskValidation),
  createTask
);

router.put(
  '/update/:id',
  auth([UserRoleEnum.MEMBER]),
  validate(updateTaskValidation),
  updateTask
);

export default router;
