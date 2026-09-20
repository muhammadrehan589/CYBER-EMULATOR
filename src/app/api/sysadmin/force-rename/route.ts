import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.forceUsernameChange = true;
    await user.save();

    return NextResponse.json({ success: true, empId: user.empId, username: user.username }, { status: 200 });
  } catch (error) {
    console.error('Error forcing username change:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
