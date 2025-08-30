import { Request, Response } from 'express';
import { TaskModel } from '../models/task.model';
import User from '../models/user.model';
import { UserRoleEnum, TaskStatusEnum, UserStatusEnum } from '../utils/enum.util';
import { logger } from '../utils/logger';
import {
  successResponse,
  internalServerErrorResponse,
  notFoundResponse,
  badRequestResponse,
} from '../utils/response.util';
import mongoose from 'mongoose';

export const getAllTasksForAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      assignee,
      createdBy,
    } = req.query as any;

    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (numericPage - 1) * numericLimit;

    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (createdBy) filter.createdBy = createdBy;

    const [tasks, total] = await Promise.all([
      TaskModel.find(filter)
        .populate('assignee', 'username email')
        .populate('createdBy', 'username email')
        .skip(skip)
        .limit(numericLimit)
        .sort({ createdAt: -1 })
        .lean(),
      TaskModel.countDocuments(filter),
    ]);

    const meta = {
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages: Math.ceil(total / numericLimit) || 1,
    };

    return successResponse(res, 'Tasks fetched successfully', { tasks, meta });
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to fetch tasks', error);
  }
};

// Get all users for admin management
export const getAllUsersForAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, role, status } = req.query as any;

    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (numericPage - 1) * numericLimit;

    const filter: any = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    const [users, total] = await Promise.all([
      User.find(filter, {
        email: 1,
        username: 1,
        role: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      })
        .skip(skip)
        .limit(numericLimit)
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments(filter),
    ]);

    const meta = {
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages: Math.ceil(total / numericLimit) || 1,
    };

    return successResponse(res, 'Users fetched successfully', { users, meta });
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to fetch users', error);
  }
};

export const assignTaskToUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { assigneeId } = req.body as { assigneeId: mongoose.Types.ObjectId };

    if (!assigneeId) {
      return badRequestResponse(res, 'Assignee ID is required');
    }

    const [task, assignee] = await Promise.all([
      TaskModel.findById(taskId),
      User.findById(assigneeId),
    ]);

    if (!task) {
      return notFoundResponse(res, 'Task not found');
    }

    if (!assignee) {
      return notFoundResponse(res, 'Assignee not found');
    }

    task.assignee = assigneeId;
    await task.save();

    const updatedTask = await TaskModel.findById(taskId)
      .populate('assignee', 'username email')
      .populate('createdBy', 'username email')
      .lean();

    if (!updatedTask) {
      return notFoundResponse(res, 'Task not found');
    }

    return successResponse(res, 'Task assigned successfully', updatedTask);
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to assign task', error);
  }
};

export const updateUserRoleAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body as { role: UserRoleEnum };

    if (!Object.values(UserRoleEnum).includes(role)) {
      return badRequestResponse(res, 'Invalid role');
    }

    const user = await User.findById(id);

    if (!user) {
      return notFoundResponse(res, 'User not found');
    }

    user.role = role;
    await user.save();

    const updatedUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return successResponse(res, 'User role updated successfully', updatedUser);
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to update user role', error);
  }
};

export const getAdminDashboardOverview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const now = new Date();

    const [
      totalUsers,
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      overdueTasks,
      recentTasks,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      TaskModel.countDocuments(),
      TaskModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            status: '$_id',
            count: 1,
          },
        },
      ]),
      TaskModel.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            priority: '$_id',
            count: 1,
          },
        },
      ]),
      TaskModel.countDocuments({
        dueDate: { $ne: null, $lt: now },
        status: { $ne: TaskStatusEnum.DONE },
      }),
      TaskModel.find()
        .populate('assignee', 'username')
        .populate('createdBy', 'username')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      User.find()
        .select('username email role createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const overview = {
      totalUsers,
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      overdueTasks,
      recentTasks,
      recentUsers,
    };

    return successResponse(
      res,
      'Admin dashboard overview fetched successfully',
      overview
    );
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(
      res,
      'Failed to fetch admin dashboard overview',
      error
    );
  }
};

export const deleteUserAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return notFoundResponse(res, 'User not found');
    }

    if (user._id.toString() === req.authUser.id.toString()) {
      return badRequestResponse(res, 'Cannot delete your own account');
    }

    if (user.role === UserRoleEnum.ADMIN) {
      const adminCount = await User.countDocuments({ role: UserRoleEnum.ADMIN });
      if (adminCount <= 1) {
        return badRequestResponse(res, 'Cannot delete the last admin user');
      }
    }

    await User.findByIdAndDelete(id);

    return successResponse(res, 'User deleted successfully');
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to delete user', error);
  }
};

export const updateUserAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, email, status } = req.body as {
      username?: string;
      email?: string;
      status?: UserStatusEnum;
    };

    const user = await User.findById(id);

    if (!user) {
      return notFoundResponse(res, 'User not found');
    }

    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (status !== undefined) user.status = status;

    await user.save();

    const updatedUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return successResponse(res, 'User updated successfully', updatedUser);
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to update user', error);
  }
};

// Create new user (admin only)
export const createUserAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role, status } = req.body as {
      username: string;
      email: string;
      password: string;
      role: UserRoleEnum;
      status: UserStatusEnum;
    };

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return badRequestResponse(res, 'User with this email or username already exists');
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password, // This will be hashed by the User model pre-save middleware
      role,
      status
    });

    await newUser.save();

    const createdUser = {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return successResponse(res, 'User created successfully', createdUser);
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to create user', error);
  }
};
