import type { IActivityLog } from '@/models/ActivityLog';

export interface IActivityLogRepository {
  findLogs(filter: Record<string, any>, limit?: number): Promise<IActivityLog[]>;
  createLog(logData: Partial<IActivityLog>): Promise<IActivityLog>;
}
