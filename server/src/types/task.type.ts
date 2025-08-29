import mongoose from 'mongoose';
import { TaskPriorityEnum, TaskStatusEnum } from '../utils/enum.util';

export interface ITask {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  dueDate?: Date | null;
  tags: string[];
  assignee: mongoose.Types.ObjectId; // User
  createdBy: mongoose.Types.ObjectId; // User
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatusEnum;
  priority?: TaskPriorityEnum;
  dueDate?: Date;
  tags?: string[];
}


export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatusEnum;
  priority?: TaskPriorityEnum;
  dueDate?: Date;
  tags?: string[];
  assignee?: mongoose.Types.ObjectId;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatusEnum;
  priority?: TaskPriorityEnum;
  assignee?: string;
  tags?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface TaskListResponse {
  tasks: ITask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
