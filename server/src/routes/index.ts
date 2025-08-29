import { Router } from 'express';
import AuthRouter from '../routes/auth.route';
import TaskRouter from '../routes/task.route';
import UserRouter from '../routes/user.route';
import StatsRouter from '../routes/stats.route';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/task', TaskRouter);
router.use('/users', UserRouter);
router.use('/stats', StatsRouter);

export default router;
