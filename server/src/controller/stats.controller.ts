import { Request, Response } from 'express';
import { TaskModel } from '../models/task.model';
import { TaskStatusEnum, UserRoleEnum } from '../utils/enum.util';
import { logger } from '../utils/logger';
import { internalServerErrorResponse, successResponse } from '../utils/response.util';

export const getOverviewStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();

    const match: any = {};

    if (req.authUser.role !== UserRoleEnum.ADMIN) {
      match.$or = [
        { createdBy: req.authUser.id },
        { assignee: req.authUser.id },
      ];
    }

    const pipeline: any[] = [
      { $match: match },
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { _id: 0, status: '$_id', count: 1 } },
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } },
            { $project: { _id: 0, priority: '$_id', count: 1 } },
          ],
          overdue: [
            {
              $match: {
                dueDate: { $ne: null, $lt: now },
                status: { $ne: TaskStatusEnum.DONE },
              },
            },
            { $count: 'count' },
          ],
        },
      },
      {
        $project: {
          byStatus: 1,
          byPriority: 1,
          overdue: { $ifNull: [{ $arrayElemAt: ['$overdue.count', 0] }, 0] },
        },
      },
    ];

    const [result] = await TaskModel.aggregate(pipeline);

    return successResponse(res, 'Stats overview fetched successfully', result || { byStatus: [], byPriority: [], overdue: 0 });
  } catch (error) {
    logger.error(error);
    return internalServerErrorResponse(res, 'Failed to fetch stats overview', error);
  }
};


