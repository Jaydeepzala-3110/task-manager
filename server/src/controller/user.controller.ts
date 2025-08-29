import { Request, Response } from 'express';
import User from '../models/user.model';
import { UserRoleEnum } from '../utils/enum.util';
import { logger } from '../utils/logger';
import {
  successResponse,
  internalServerErrorResponse,
  notFoundResponse,
} from '../utils/response.util';

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, username, email, role, status } = req.query as any;

    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (numericPage - 1) * numericLimit;

    const filter: any = {};

    if (username) filter.username = { $regex: new RegExp(username, 'i') };
    if (email) filter.email = { $regex: new RegExp(email, 'i') };
    if (role) filter.role = role;
    if (status) filter.status = status;

    const [users, total] = await Promise.all([
      User.find(filter, {
        email: 1,
        username: 1,
        role: 1,
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

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body as { role: UserRoleEnum };

    const user = await User.findById(id);

    if (!user) {
      return notFoundResponse(res, 'User not found');
    }

    user.role = role as UserRoleEnum;

    await user.save();

    const updatedUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return successResponse(res, 'User role updated successfully', updatedUser);
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to update user role', error);
  }
};
