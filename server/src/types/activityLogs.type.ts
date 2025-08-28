import mongoose from 'mongoose';
import { ActivityActionEnum } from '../utils/enum.util';

export interface IActivityLog {
  _id: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  action: ActivityActionEnum;
  changes?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
