export interface IActivityLogRepository {
  findLogs(filter: Record<string, any>, limit?: number): Promise<any[]>;
  createLog(logData: any): Promise<any>;
}
