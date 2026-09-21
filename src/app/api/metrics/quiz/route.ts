import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { username, correctAnswers, wrongAnswers } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { username },
      { 
        $inc: { 
          'metrics.correctAnswers': correctAnswers || 0,
          'metrics.wrongAnswers': wrongAnswers || 0
        } 
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Quiz metrics updated successfully', metrics: user.metrics }, { status: 200 });
  } catch (error) {
    console.error('Error updating quiz metrics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
