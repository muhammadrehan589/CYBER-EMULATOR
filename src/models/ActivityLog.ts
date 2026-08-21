import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  empId: string;
  timestamp: Date;
  action: string;
  type: 'login' | 'score' | 'flag' | 'status_change';
  details: string;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    empId: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['login', 'score', 'flag', 'status_change'],
    },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
