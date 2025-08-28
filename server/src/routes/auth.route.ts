import { Router } from 'express';
import {
  register,
} from '../controller/auth.controller';
import { auth } from '../middlewares/auth.middleware';
import { UserRoleEnum } from '../utils/enum.util';
import { validate } from '../utils/validation.util';
import { registerValidation } from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerValidation), register);

export default router;
