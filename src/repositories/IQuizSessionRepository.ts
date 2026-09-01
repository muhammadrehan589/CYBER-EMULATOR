export interface IQuizSessionRepository {
  findSessions(filter: Record<string, any>): Promise<any[]>;
  createSession(sessionData: any): Promise<any>;
}
