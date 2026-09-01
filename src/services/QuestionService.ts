import { IQuestionRepository } from '@/repositories/IQuestionRepository';

export class QuestionService {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async getQuestions(category?: string | null, difficulty?: string | null, limit?: string | null, random?: string | null) {
    const filter: Record<string, any> = {};

    if (category) {
      filter.category = category;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (random === 'true') {
      const size = limit ? parseInt(limit) : 10;
      return this.questionRepository.getRandomQuestions(filter, size);
    }

    const limitNum = limit ? parseInt(limit) : undefined;
    return this.questionRepository.findQuestions(filter, limitNum);
  }
}
