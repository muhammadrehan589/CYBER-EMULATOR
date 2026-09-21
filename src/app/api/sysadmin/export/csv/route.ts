import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const type = searchParams.get('type');

    if (!username || !type) {
      return NextResponse.json({ error: 'Missing username or type parameter' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ username }).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let csvString = '';
    let filename = '';

    if (type === 'logins') {
      csvString = 'Email,Timestamp\n';
      const logins = user.loginHistory || [];
      logins.forEach((date: any) => {
        csvString += `"${user.email || ''}","${new Date(date).toISOString()}"\n`;
      });
      filename = `${username}_logins.csv`;
        } else if (type === 'metrics') {
      csvString = 'Email,CorrectAnswers,WrongAnswers,DuelsPlayed,DuelsWon\n';
      const metrics = user.metrics || { correctAnswers: 0, wrongAnswers: 0, duelsPlayed: 0, duelsWon: 0 };
      csvString += `"${user.email || ''}",${metrics.correctAnswers},${metrics.wrongAnswers},${metrics.duelsPlayed},${metrics.duelsWon}\n`;
      filename = `${username}_metrics.csv`;
    } else if (type === 'evaluations') {
      const QuizSession = (await import('@/models/QuizSession')).default;
      const sessions = await QuizSession.find({ empId: user.empId }).lean();
      csvString = 'StartedAt,FinalScore,QuestionsPlayed,HighestStreak\n';
      sessions.forEach((s) => {
        csvString += `"${s.startedAt ? new Date(s.startedAt).toISOString() : ''}",${s.finalScore || 0},${s.sessionLogs?.length || 0},${s.highestStreak || 0}\n`;
      });
      filename = `${username}_evaluations.csv`;
    } else {
      return NextResponse.json({ error: 'Invalid type parameter.' }, { status: 400 });
    }

    return new Response(csvString, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
