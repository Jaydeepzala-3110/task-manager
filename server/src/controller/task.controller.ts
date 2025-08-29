import { Request, Response } from 'express';
import { TaskModel } from '../models/task.model';
import { UserRoleEnum, ActivityActionEnum } from '../utils/enum.util';
import { logger } from '../utils/logger';
import {
  successResponse,
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from '../utils/response.util';
import ActivityLog from '../models/activityLog.model';
import { ICreateTaskRequest, UpdateTaskRequest } from '../types/task.type';

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

export const listTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      assignee,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      dueDateFrom,
      dueDateTo,
    } = req.query as any;

    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (numericPage - 1) * numericLimit;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (tags) filter.tags = { $in: tags.split(',').map((t: string) => t.trim()).filter(Boolean) };

    if (dueDateFrom || dueDateTo) {
      filter.dueDate = {} as any;
      if (dueDateFrom) filter.dueDate.$gte = new Date(dueDateFrom);
      if (dueDateTo) filter.dueDate.$lte = new Date(dueDateTo);
    }

    if (req.authUser.role !== UserRoleEnum.ADMIN) {
      filter.$and = (filter.$and || []).concat([
        {
          $or: [
            { createdBy: req.authUser.id },
            { assignee: req.authUser.id },
          ],
        },
      ]);
    }

    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [tasks, total] = await Promise.all([
      TaskModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(numericLimit)
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

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updateData: UpdateTaskRequest = req.body;

    const task = await TaskModel.findOne({ _id: id });

    if (!task) {
      return notFoundResponse(res, 'Task not found');
    }

    if (!canAccessTask(task, req.authUser.id, req.authUser.role)) {
      return unauthorizedResponse(res, 'You do not have permission to update this task');
    }

    if (updateData.assignee && req.authUser.role !== UserRoleEnum.ADMIN) {
      return unauthorizedResponse(res, 'Only admins can change task assignee');
    }

    const oldTask = { ...task.toObject() };

    Object.assign(task, updateData);

    await task.save();

    await ActivityLog.updateOne({
      task: task._id,
      user: req.authUser.id,
      action: ActivityActionEnum.UPDATE,
      changes: { old: oldTask, new: updateData },
    });

    return successResponse(res, 'Task updated successfully', task);
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to update task', error);
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await TaskModel.findOne({ _id: id });

    if (!task) {
      return notFoundResponse(res, 'Task not found');
    }

    if (!canAccessTask(task, req.authUser.id, req.authUser.role)) {
      return unauthorizedResponse(res, 'You do not have permission to delete this task');
    }

    await ActivityLog.updateOne({
      task: task._id,
      user: req.authUser.id,
      action: ActivityActionEnum.DELETE,
      changes: { deletedTask: task.toObject() },
    });

    await TaskModel.deleteOne({ _id: id });

    return successResponse(res, 'Task deleted successfully');
  } catch (error) {
    logger.error('Error deleting task:', error);
    return internalServerErrorResponse(res, 'Failed to delete task', error);
  }
};
