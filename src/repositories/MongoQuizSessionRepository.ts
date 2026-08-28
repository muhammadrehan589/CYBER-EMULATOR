import QuizSession from '@/models/QuizSession';
import { IQuizSessionRepository } from './IQuizSessionRepository';

export class MongoQuizSessionRepository implements IQuizSessionRepository {
  async findSessions(filter: Record<string, any>): Promise<any[]> {
    return QuizSession.find(filter).sort({ startedAt: -1 }).lean();
  }

  async createSession(sessionData: any): Promise<any> {
    return QuizSession.create(sessionData);
  }
}
