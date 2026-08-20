import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import QuizSession from '@/models/QuizSession';

// GET /api/quiz-sessions - Fetch sessions for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const empId = searchParams.get('empId');

    const filter: Record<string, any> = {};
    if (empId) {
      filter.empId = empId;
    }

    const sessions = await QuizSession.find(filter)
      .sort({ startedAt: -1 })
      .lean();

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
    const { empId, finalScore, highestStreak, questionsPlayed, sessionLogs } = body;

    const session = await QuizSession.create({
      empId,
      finalScore,
      highestStreak,
      questionsPlayed,
      sessionLogs,
      completedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error: any) {
    console.error('[API] POST /api/quiz-sessions error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
