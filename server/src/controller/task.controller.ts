import { Request, Response } from 'express';
import { TaskModel } from '../models/task.model';
import { UserRoleEnum, ActivityActionEnum } from '../utils/enum.util';
import { logger } from '../utils/logger';
import { successResponse, internalServerErrorResponse } from '../utils/response.util';
import ActivityLog from '../models/activityLog.model';
import { ICreateTaskRequest } from '../types/task.type';

const canAccessTask = (task: any, userId: string, userRole: string): boolean => {
  return userRole === UserRoleEnum.ADMIN || task.createdBy.toString() === userId;
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskData: ICreateTaskRequest = req.body;

    const task = new TaskModel({
      ...taskData,
      createdBy: req.authUser.id,
      assignee: req.authUser.id,
    });

    await task.save();

    await ActivityLog.create({
      task: task._id,
      user: req.authUser.id,
      action: ActivityActionEnum.CREATE,
      changes: taskData,
    });

    return successResponse(res, 'Task created successfully', task);
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to create task', error);
  }
};
