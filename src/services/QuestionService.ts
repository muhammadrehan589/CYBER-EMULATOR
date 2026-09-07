import { IQuestionRepository } from '@/repositories/IQuestionRepository';

export class QuestionService {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async getQuestions(category?: string | null, difficulty?: string | null, limit?: string | null, random?: string | null, exclude?: string | null, pool?: string | null) {
    const filter: Record<string, any> = {};

    if (category) {
      filter.category = category;
    }

    if (pool) {
      filter.pool = pool;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (random === 'true') {
      const size = limit ? parseInt(limit) : 10;
      if (exclude) {
        const ids = exclude.split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
        if (ids.length > 0) filter.questionId = { $nin: ids };
      }
      return this.questionRepository.getRandomQuestions(filter, size);
    }

    const limitNum = limit ? parseInt(limit) : undefined;
    if (exclude) {
      const ids = exclude.split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
      if (ids.length > 0) filter.questionId = { $nin: ids };
    }
    return this.questionRepository.findQuestions(filter, limitNum);
  }
}
