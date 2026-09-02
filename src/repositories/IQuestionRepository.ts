import type { IQuestion } from '@/models/Question';

export interface IQuestionRepository {
  findQuestions(filter: Record<string, any>, limit?: number): Promise<IQuestion[]>;
  getRandomQuestions(filter: Record<string, any>, size: number): Promise<IQuestion[]>;
}
