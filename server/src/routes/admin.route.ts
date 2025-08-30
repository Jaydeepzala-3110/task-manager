import { Router } from 'express';
import {
  getAllTasksForAdmin,
  getAllUsersForAdmin,
  assignTaskToUser,
  updateUserRoleAdmin,
  getAdminDashboardOverview,
  deleteUserAdmin,
  updateUserAdmin,
  createUserAdmin,
} from '../controller/admin.controller';
import { auth } from '../middlewares/auth.middleware';
import { UserRoleEnum } from '../utils/enum.util';
import { validate } from '../utils/validation.util';
import {
  getAllTasksForAdminValidation,
  assignTaskToUserValidation,
  getAllUsersForAdminValidation,
  updateUserRoleAdminValidation,
  deleteUserAdminValidation,
  updateUserAdminValidation,
  createUserAdminValidation,
} from '../validations/admin.validation';

const router = Router();

// All routes require admin authentication
router.use(auth([UserRoleEnum.ADMIN]));

// Admin dashboard overview
router.get('/dashboard/overview', getAdminDashboardOverview);

// Task management
router.get('/tasks', validate(getAllTasksForAdminValidation), getAllTasksForAdmin);
router.patch('/tasks/:taskId/assign', validate(assignTaskToUserValidation), assignTaskToUser);

// User management
router.post('/users', validate(createUserAdminValidation), createUserAdmin);
router.get('/users', validate(getAllUsersForAdminValidation), getAllUsersForAdmin);
router.patch('/users/:id/role', validate(updateUserRoleAdminValidation), updateUserRoleAdmin);
router.delete('/users/:id', validate(deleteUserAdminValidation), deleteUserAdmin);
router.put('/users/:id', validate(updateUserAdminValidation), updateUserAdmin);

export default router;
