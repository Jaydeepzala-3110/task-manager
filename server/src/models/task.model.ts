import mongoose, { Schema } from 'mongoose';
import { ITask } from '../types/task.type';
import { TaskPriorityEnum, TaskStatusEnum } from '../utils/enum.util';

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true  },
    description: { type: String, default: '' ,},
    status: {
      type: String,
      enum: TaskStatusEnum,
      default: TaskStatusEnum.TODO,
    },
    priority: {
      type: String,
      enum: TaskPriorityEnum,
      default: TaskPriorityEnum.LOW,
    },
    dueDate: { type: Date, },
    tags: { type: [String], default: [] },
    assignee: { type: Schema.Types.ObjectId, ref: 'User', required: true,  },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, },
  },
  { timestamps: true }
);


export type TaskDocument = ITask;

export const TaskModel = mongoose.model('Task', taskSchema);
