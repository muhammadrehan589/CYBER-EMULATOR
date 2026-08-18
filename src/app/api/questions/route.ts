import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';

// GET /api/questions - Fetch questions with optional filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const limit = searchParams.get('limit');
    const random = searchParams.get('random');

    const filter: Record<string, any> = {};

    if (category) {
      filter.category = category;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Return randomized questions using MongoDB $sample
    if (random === 'true') {
      const pipeline: any[] = [];

      if (Object.keys(filter).length > 0) {
        pipeline.push({ $match: filter });
      }

      pipeline.push({ $sample: { size: limit ? parseInt(limit) : 10 } });

      const questions = await Question.aggregate(pipeline);
      return NextResponse.json({ success: true, data: questions });
    }

    let query = Question.find(filter).sort({ questionId: 1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const questions = await query.lean();

    return NextResponse.json({ success: true, data: questions });
  } catch (error: any) {
    console.error('[API] GET /api/questions error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
