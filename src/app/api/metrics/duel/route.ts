import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { username, isWin } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    await connectDB();

    const incQuery: any = { 'metrics.duelsPlayed': 1 };
    if (isWin) {
      incQuery['metrics.duelsWon'] = 1;
    }

    const user = await User.findOneAndUpdate(
      { username },
      { $inc: incQuery },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Duel metrics updated successfully', metrics: user.metrics }, { status: 200 });
  } catch (error) {
    console.error('Error updating duel metrics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
