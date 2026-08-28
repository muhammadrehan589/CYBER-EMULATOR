import ActivityLog from '@/models/ActivityLog';
import { IActivityLogRepository } from './IActivityLogRepository';

export class MongoActivityLogRepository implements IActivityLogRepository {
  async findLogs(filter: Record<string, any>, limit: number = 100): Promise<any[]> {
    return ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
  }

  async createLog(logData: any): Promise<any> {
    return ActivityLog.create(logData);
  }
}
