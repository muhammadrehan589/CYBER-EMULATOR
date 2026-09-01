import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserService } from '@/services/UserService';
import { MongoUserRepository } from '@/repositories/MongoUserRepository';

const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);

// POST /api/auth/login - Authenticate a user with username + password
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, password } = body;

    const safeUser = await userService.authenticate(username, password);

    return NextResponse.json({
      success: true,
      data: safeUser,
    });
  } catch (error: any) {
    console.error('[API] POST /api/auth/login error:', error);
    
    // Map specific errors to status codes to respect the original behavior
    let status = 500;
    if (error.message.includes('required')) status = 400;
    else if (error.message.includes('suspended')) status = 403;
    else if (error.message.includes('Invalid') || error.message.includes('No password set')) status = 401;

    return NextResponse.json(
      { success: false, error: error.message },
      { status }
    );
  }
}
