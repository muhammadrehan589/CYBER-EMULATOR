import Question from '@/models/Question';
import { IQuestionRepository } from './IQuestionRepository';

export class MongoQuestionRepository implements IQuestionRepository {
  async findQuestions(filter: Record<string, any>, limit?: number): Promise<any[]> {
    let query = Question.find(filter).sort({ questionId: 1 });
    if (limit) {
      query = query.limit(limit);
    }
    return query.lean();
  }

  async getRandomQuestions(filter: Record<string, any>, size: number): Promise<any[]> {
    const pipeline: any[] = [];
    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter });
    }
    pipeline.push({ $sample: { size } });
    return Question.aggregate(pipeline);
  }
}
