import { IActivityLogRepository } from '@/repositories/IActivityLogRepository';

export class ActivityLogService {
  constructor(private readonly activityLogRepository: IActivityLogRepository) {}

  async getLogs(empId?: string | null) {
    const filter: Record<string, any> = {};
    if (empId) {
      filter.empId = empId;
    }
    return this.activityLogRepository.findLogs(filter);
  }

  async createLog(logData: any) {
    return this.activityLogRepository.createLog({
      empId: logData.empId,
      action: logData.action,
      type: logData.type,
      details: logData.details,
    });
  }
}
