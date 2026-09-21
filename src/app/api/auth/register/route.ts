import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { employeeId, email, username, password } = await req.json();

    if (!employeeId || !email || !username || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    // Strict uniqueness checks
    const usernameUser = await User.findOne({ username });
    if (usernameUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    const emailUser = await User.findOne({ email });
    if (emailUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    const empIdUser = await User.findOne({ empId: employeeId });
    if (empIdUser) {
      return NextResponse.json({ error: 'Employee ID is already registered' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the new User document
    const newUser = await User.create({
      empId: employeeId,
      name: email.split('@')[0],
      email,
      username,
      passwordHash,
      role: 'Player'
    });

    return NextResponse.json(
      { success: true, message: 'User registered successfully', userId: newUser.empId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Register API Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
