import { Router } from 'express';
import {
  createTask,
  deleteTask,
  updateTask,
  listTasks,
} from '../controller/task.controller';
import { validate } from '../utils/validation.util';
import {
  createTaskValidation,
  deleteTaskValidation,
  updateTaskValidation,
  listTaskValidation,
} from '../validations/task.validation';
import { auth } from '../middlewares/auth.middleware';
import { UserRoleEnum } from '../utils/enum.util';

const router = Router();

router.get(
  '/list',
  auth([UserRoleEnum.MEMBER, UserRoleEnum.ADMIN]),
  validate(listTaskValidation),
  listTasks
);


router.post(
  '/create',
  auth([UserRoleEnum.MEMBER]),
  validate(createTaskValidation),
  createTask
);

router.put(
  '/update/:id',
  auth([UserRoleEnum.MEMBER, UserRoleEnum.ADMIN]),
  validate(updateTaskValidation),
  updateTask
);

router.delete(
  '/delete/:id',
  auth([UserRoleEnum.MEMBER, UserRoleEnum.ADMIN]),
  validate(deleteTaskValidation),
  deleteTask
);

export default router;
