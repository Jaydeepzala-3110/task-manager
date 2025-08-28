import mongoose, { Schema } from 'mongoose';
import { IActivityLog } from '../types/activityLogs.type';
import { ActivityActionEnum } from '../utils/enum.util';

const activityLogSchema = new Schema(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: {
      type: String,
      enum: Object.values(ActivityActionEnum),
      required: true,
      index: true,
    },
    changes: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type ActivityLogDocument = IActivityLog;

export const ActivityLogModel = mongoose.model('ActivityLog', activityLogSchema);
