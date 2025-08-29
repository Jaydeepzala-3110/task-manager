import mongoose, { Schema } from 'mongoose';
import { IActivityLog } from '../types/activityLogs.type';
import { ActivityActionEnum } from '../utils/enum.util';

const activityLogSchema = new Schema(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true, },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, },
    action: {
      type: String,
      enum: ActivityActionEnum,
      required: true,
    },
    changes: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);


const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;