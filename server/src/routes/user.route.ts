import { Router } from 'express';
import { listUsers, updateUserRole } from '../controller/user.controller';
import { auth } from '../middlewares/auth.middleware';
import { UserRoleEnum } from '../utils/enum.util';
import { validate } from '../utils/validation.util';
import {
  listUsersValidation,
  updateUserRoleValidation,
} from '../validations/user.validation';

const router = Router();

router.get('/', auth([UserRoleEnum.ADMIN]), validate(listUsersValidation), listUsers);

router.patch(
  '/:id/role',
  auth([UserRoleEnum.ADMIN]),
  validate(updateUserRoleValidation),
  updateUserRole
);

export default router;
