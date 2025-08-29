import { Request, Response } from 'express';
import { TaskModel } from '../models/task.model';
import { UserRoleEnum, ActivityActionEnum } from '../utils/enum.util';
import { logger } from '../utils/logger';
import { successResponse, internalServerErrorResponse, notFoundResponse, unauthorizedResponse } from '../utils/response.util';
import ActivityLog from '../models/activityLog.model';
import { ICreateTaskRequest, UpdateTaskRequest } from '../types/task.type';

const canAccessTask = (task: any, userId: string, userRole: string): boolean => {

  if(task.createdBy.toString() === userId) {
    logger.info("user this is the one ")
  }
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

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('controller reached here')
    const { id } = req.params;

    const updateData: UpdateTaskRequest = req.body;

    const task = await TaskModel.findOne({_id : id});

    if (!task) {
      return notFoundResponse(res, 'Task not found');
    }

    if (!canAccessTask(task,req.authUser.id,req.authUser.role)) {
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