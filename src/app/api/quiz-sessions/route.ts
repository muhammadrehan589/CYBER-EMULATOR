import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { QuizSessionService } from '@/services/QuizSessionService';
import { MongoQuizSessionRepository } from '@/repositories/MongoQuizSessionRepository';

const quizSessionRepository = new MongoQuizSessionRepository();
const quizSessionService = new QuizSessionService(quizSessionRepository);

// GET /api/quiz-sessions - Fetch sessions for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const empId = searchParams.get('empId');

    const sessions = await quizSessionService.getSessions(empId);

    return NextResponse.json({ success: true, data: sessions });
  } catch (error: any) {
    console.error('[API] GET /api/quiz-sessions error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quiz-sessions - Save a completed quiz session
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const session = await quizSessionService.createSession(body);

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error: any) {
    console.error('[API] POST /api/quiz-sessions error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
