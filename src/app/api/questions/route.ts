import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { QuestionService } from '@/services/QuestionService';
import { MongoQuestionRepository } from '@/repositories/MongoQuestionRepository';

const questionRepository = new MongoQuestionRepository();
const questionService = new QuestionService(questionRepository);

export const dynamic = 'force-dynamic';

// GET /api/questions - Fetch questions with optional filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const limit = searchParams.get('limit');
    const random = searchParams.get('random');
    const exclude = searchParams.get('exclude');
    const pool = searchParams.get('pool');

    const batch = searchParams.get('batch');

    if (batch === '711') {
      const excludeIds = exclude ? exclude.split(',').filter(x => x) : [];
      
      const easy = await questionService.getQuestions(category, 'easy', '7', 'true', exclude, pool);
      const excludeEasy = [...excludeIds, ...easy.map(q => q.questionId)].join(',');
      
      const medium = await questionService.getQuestions(category, 'medium', '1', 'true', excludeEasy, pool);
      const excludeMed = [...excludeEasy.split(','), ...medium.map(q => q.questionId)].filter(x => x).join(',');
      
      const hard = await questionService.getQuestions(category, 'hard', '1', 'true', excludeMed, pool);
      
      let combined = [...easy, ...medium, ...hard];

      // Fallback: if we don't have enough medium/hard questions in the database, fill the rest with whatever is available (likely easy)
      if (combined.length < 9) {
        const excludeCombined = [...excludeIds, ...combined.map(q => q.questionId)].filter(x => x).join(',');
        const fallbackCount = (9 - combined.length).toString();
        const fallback = await questionService.getQuestions(category, null, fallbackCount, 'true', excludeCombined, pool);
        combined = [...combined, ...fallback];
      }

      combined = combined.sort(() => Math.random() - 0.5);
      
      return NextResponse.json({ success: true, data: combined });
    }

    const questions = await questionService.getQuestions(category, difficulty, limit, random, exclude, pool);

    return NextResponse.json({ success: true, data: questions });
  } catch (error: any) {
    console.error('[API] GET /api/questions error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
