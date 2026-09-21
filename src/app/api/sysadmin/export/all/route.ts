import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type || (type !== 'logins' && type !== 'scores' && type !== 'evaluations')) {
      return NextResponse.json({ error: 'Invalid type parameter. Must be logins, scores, or evaluations' }, { status: 400 });
    }

    await connectDB();
    const users = await User.find({}).lean();

    let csvString = '';
    let filename = '';

    if (type === 'logins') {
      csvString = 'EmpID,Username,Email,Timestamp\n';
      users.forEach(user => {
        const logins = user.loginHistory || [];
        logins.forEach(date => {
          csvString += `"${user.empId || ''}","${user.username || ''}","${user.email || ''}","${new Date(date).toISOString()}"\n`;
        });
      });
      filename = 'all_players_logins.csv';
    } else if (type === 'scores') {
      csvString = 'EmpID,Username,Email,Score,Coins,XP,CorrectAnswers,DuelsWon\n';
      users.forEach(user => {
        const metrics = user.metrics || { correctAnswers: 0, duelsWon: 0 };
        csvString += `"${user.empId || ''}","${user.username || ''}","${user.email || ''}",${user.score || 0},${user.coins || 0},${user.xp || 0},${metrics.correctAnswers || 0},${metrics.duelsWon || 0}\n`;
      });
      filename = 'all_players_scores.csv';
    } else if (type === 'evaluations') {
      const QuizSession = (await import('@/models/QuizSession')).default;
      const sessions = await QuizSession.find({}).lean();
      csvString = 'EmpID,StartedAt,FinalScore,QuestionsPlayed,HighestStreak\n';
      sessions.forEach((s: any) => {
        csvString += `"${s.empId || ''}","${s.startedAt ? new Date(s.startedAt).toISOString() : ''}",${s.finalScore || 0},${s.sessionLogs?.length || 0},${s.highestStreak || 0}\n`;
      });
      filename = 'all_evaluations_report.csv';
    }

    return new Response(csvString, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Error exporting all CSV:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
