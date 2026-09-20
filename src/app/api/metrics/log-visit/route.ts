import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { empId, username, dbId } = await req.json();

    if (!empId && !username && !dbId) {
      return NextResponse.json({ error: 'Missing identification parameters' }, { status: 400 });
    }

    await connectDB();
    
    let user;
    if (dbId) {
      user = await User.findById(dbId);
    } else if (empId) {
      user = await User.findOne({ empId });
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Append a new login/visit timestamp
    user.loginHistory.push(new Date());
    user.isOnline = true;
    await user.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error logging visit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
