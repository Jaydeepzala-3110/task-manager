import { Router } from 'express';
import { createTask } from '../controller/task.controller';
import { validate } from '../utils/validation.util';
import { createTaskValidation } from '../validations/task.validation';
import { auth } from '../middlewares/auth.middleware';
import { UserRoleEnum } from '../utils/enum.util';

const router = Router();

router.post(
  '/create',
  auth([UserRoleEnum.MEMBER]),
  validate(createTaskValidation),
  createTask
);

export default router;
