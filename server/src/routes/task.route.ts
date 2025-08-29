import { Router } from 'express';
import { createTask, deleteTask, updateTask } from '../controller/task.controller';
import { validate } from '../utils/validation.util';
import { createTaskValidation, deleteTaskValidation, updateTaskValidation } from '../validations/task.validation';
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

router.delete(
  '/delete/:id',
  auth([UserRoleEnum.MEMBER]),
  validate(deleteTaskValidation),
  deleteTask
);


export default router;
