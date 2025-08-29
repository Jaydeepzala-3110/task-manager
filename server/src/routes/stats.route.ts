import { Router } from 'express';
import { getOverviewStats } from '../controller/stats.controller';
import { auth } from '../middlewares/auth.middleware';
import { UserRoleEnum } from '../utils/enum.util';

const router = Router();

router.get('/overview', auth([UserRoleEnum.MEMBER, UserRoleEnum.ADMIN]), getOverviewStats);

export default router;


