import mongoose, { Schema } from 'mongoose';
import { ITask } from '../types/task.type';
import { TaskPriorityEnum, TaskStatusEnum } from '../utils/enum.util';

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: TaskStatusEnum,
      default: TaskStatusEnum.TODO,
      index: true,
    },
    priority: {
      type: String,
      enum: TaskPriorityEnum,
      default: TaskPriorityEnum.MEDIUM,
      index: true,
    },
    dueDate: { type: Date, index: true },
    tags: { type: [String], default: [] },
    assignee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text', description: 'text', tags: 1 });

export type TaskDocument = ITask;

export const TaskModel = mongoose.model('Task', taskSchema);
