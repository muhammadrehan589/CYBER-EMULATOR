import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// POST /api/auth/login - Authenticate a user with username + password
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // Strip leading @ if present
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');

    // Find user by username (case-insensitive)
    const user = await User.findOne({
      username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') },
    }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Check if user is suspended
    if ((user as any).status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'Account suspended. Contact your administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const storedHash = (user as any).passwordHash;

    if (!storedHash) {
      // User has no password set yet — deny login
      return NextResponse.json(
        { success: false, error: 'No password set. Contact your administrator.' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, storedHash);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Strip passwordHash from response
    const { passwordHash, ...safeUser } = user as any;

    return NextResponse.json({
      success: true,
      data: safeUser,
    });
  } catch (error: any) {
    console.error('[API] POST /api/auth/login error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
