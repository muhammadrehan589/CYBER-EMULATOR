export interface IQuestionRepository {
  findQuestions(filter: Record<string, any>, limit?: number): Promise<any[]>;
  getRandomQuestions(filter: Record<string, any>, size: number): Promise<any[]>;
}
