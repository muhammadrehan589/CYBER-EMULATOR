import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/users - Fetch users with optional filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const filter: Record<string, any> = {};

    if (department && department !== 'ALL') {
      filter.department = department;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { empId: regex },
        { name: regex },
        { username: regex },
      ];
    }

    const users = await User.find(filter).sort({ score: -1 }).lean();

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error('[API] GET /api/users error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { empId, name, username, department, role } = body;

    const user = await User.create({
      empId,
      name,
      username,
      department,
      role: role || 'Player',
      score: 1000,
      status: 'active',
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error: any) {
    console.error('[API] POST /api/users error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'User with this empId or username already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/users - Update a user (status toggle, score, avatar, etc.)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { empId, updates } = body;

    if (!empId || !updates) {
      return NextResponse.json(
        { success: false, error: 'empId and updates are required.' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { empId },
      { $set: updates },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error('[API] PATCH /api/users error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
