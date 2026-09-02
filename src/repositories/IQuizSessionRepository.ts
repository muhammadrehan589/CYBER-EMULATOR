import type { IQuizSession } from '@/models/QuizSession';

export interface IQuizSessionRepository {
  findSessions(filter: Record<string, any>): Promise<IQuizSession[]>;
  createSession(sessionData: Partial<IQuizSession>): Promise<IQuizSession>;
}
