import { IQuizSessionRepository } from '@/repositories/IQuizSessionRepository';

export class QuizSessionService {
  constructor(private readonly quizSessionRepository: IQuizSessionRepository) {}

  async getSessions(empId?: string | null) {
    const filter: Record<string, any> = {};
    if (empId) {
      filter.empId = empId;
    }
    return this.quizSessionRepository.findSessions(filter);
  }

  async createSession(sessionData: any) {
    return this.quizSessionRepository.createSession({
      ...sessionData,
      completedAt: new Date(),
    });
  }
}
