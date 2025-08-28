import { Router } from 'express';
import { login, register } from '../controller/auth.controller';
import { auth } from '../middlewares/auth.middleware';
import { UserRoleEnum } from '../utils/enum.util';
import { validate } from '../utils/validation.util';
import { loginValidation, registerValidation } from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerValidation), register);

router.post('/login', validate(loginValidation), login);

export default router;
