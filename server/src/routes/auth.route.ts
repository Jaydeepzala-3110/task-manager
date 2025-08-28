import { Router } from 'express';
import { login, logout, register } from '../controller/auth.controller';
import { validate } from '../utils/validation.util';
import { loginValidation, registerValidation } from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerValidation), register);

router.post('/login', validate(loginValidation), login);

router.post('/logout' , logout)

export default router;
