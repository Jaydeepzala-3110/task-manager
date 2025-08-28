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
