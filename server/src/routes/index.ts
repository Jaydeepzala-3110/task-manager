import { Router } from 'express';
import AuthRouter from '../routes/auth.route';
import TaskRouter from '../routes/task.route';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/task', TaskRouter);

export default router;
