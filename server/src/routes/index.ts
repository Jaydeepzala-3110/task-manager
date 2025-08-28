import { Router } from 'express';
import AuthRouter from '../routes/auth.route';

const router = Router();

router.use('/auth', AuthRouter);

export default router;
